import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { AccountContext } from "./AccountProvide";

export const CallContext = createContext(null);

const STUN = [{ urls: "stun:stun.l.google.com:19302" }];

export default function CallProvider({ children }) {
  const { socket, account, localAccount } = useContext(AccountContext);

  const me = useMemo(
    () => ({
      id: account?.sub || localAccount?._id,
      name: account?.name || localAccount?.name || "Me",
    }),
    [account, localAccount]
  );

  const [roomId, setRoomId] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isCallStarter, setIsCallStarter] = useState(false);
  const pcMapRef = useRef(new Map());
  const pendingOffersRef = useRef(new Set());
  const pendingPeersRef = useRef([]); 
  const streamReadyNotifiedRef = useRef(false);

  const addRemoteStream = useCallback((socketId, stream) => {
    console.log("Adding remote stream for:", socketId, stream);
    setRemoteStreams((prev) => new Map(prev).set(socketId, stream));
  }, []);

  const removeRemoteStream = useCallback((socketId) => {
    console.log("Removing remote stream for:", socketId);
    setRemoteStreams((prev) => {
      const next = new Map(prev);
      next.delete(socketId);
      return next;
    });
  }, []);

  // Get local media stream
  const ensureLocalStream = useCallback(async (
    constraints = { audio: true, video: { width: 1280, height: 720 } }
  ) => {
    if (localStream) return localStream;
    
    try {
      console.log("Requesting user media...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Got local stream with tracks:", stream.getTracks().map(t => `${t.kind}: ${t.label}`));
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error getting user media:", error);
      throw error;
    }
  }, [localStream]);

  // Create peer connection
  const ensurePeerConnection = useCallback(async (peerSocketId, stream) => {
    let pc = pcMapRef.current.get(peerSocketId);
    if (pc) {
      // If peer connection exists but stream changed, update tracks
      if (stream) {
        const existingSenders = pc.getSenders();
        const streamTracks = stream.getTracks();
        
        // Add new tracks if not already present
        streamTracks.forEach(track => {
          const existingSender = existingSenders.find(s => s.track?.kind === track.kind);
          if (!existingSender) {
            console.log(`Adding ${track.kind} track to existing peer connection for:`, peerSocketId);
            pc.addTrack(track, stream);
          }
        });
      }
      return pc;
    }

    console.log("Creating peer connection for:", peerSocketId);
    pc = new RTCPeerConnection({ iceServers: STUN });

    // Handle ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate && socket?.current) {
        console.log("Sending ICE candidate to:", peerSocketId);
        socket.current.emit("webrtc:ice-candidate", {
          to: peerSocketId,
          from: socket.current.id,
          candidate: e.candidate,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerSocketId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.log(`Connection failed/disconnected with ${peerSocketId}, cleaning up`);
        removeRemoteStream(peerSocketId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${peerSocketId}:`, pc.iceConnectionState);
    };

    // Handle remote tracks
    pc.ontrack = (e) => {
      console.log("Received track from:", peerSocketId, e.track.kind, e.track.label);
      if (e.streams && e.streams[0]) {
        console.log("Adding remote stream from:", peerSocketId);
        addRemoteStream(peerSocketId, e.streams[0]);
      }
    };

    // Add local tracks if we have them
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log(`Adding ${track.kind} track to peer connection for:`, peerSocketId);
        pc.addTrack(track, stream);
      });
    }

    pcMapRef.current.set(peerSocketId, pc);
    return pc;
  }, [socket, addRemoteStream, removeRemoteStream]);

  // Create offer with delay for stream readiness
  const createPeerConnectionAndOffer = useCallback(async (peerSocketId, rId, stream, maxRetries = 3) => {
    if (!stream || !socket?.current) {
      console.log("Cannot create offer - missing stream or socket");
      return;
    }

    if (pendingOffersRef.current.has(peerSocketId)) {
      console.log("Offer already pending for:", peerSocketId);
      return;
    }

    try {
      console.log("Creating offer for:", peerSocketId, "with stream tracks:", stream.getTracks().map(t => t.kind));
      pendingOffersRef.current.add(peerSocketId);
      
      // Wait a bit to ensure the other peer has joined and is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pc = await ensurePeerConnection(peerSocketId, stream);
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pc.setLocalDescription(offer);
      
      socket.current.emit("webrtc:offer", {
        to: peerSocketId,
        from: socket.current.id,
        roomId: rId,
        description: pc.localDescription,
      });
      console.log("Sent offer to:", peerSocketId);
    } catch (error) {
      console.error("Error creating offer:", error);
      pendingOffersRef.current.delete(peerSocketId);
    }
  }, [socket, ensurePeerConnection]);

  // Notify about stream readiness
  const notifyStreamReady = useCallback(() => {
    if (localStream && roomId && socket?.current && !streamReadyNotifiedRef.current) {
      console.log("Notifying room about stream readiness");
      socket.current.emit("webrtc:stream-ready", { roomId, socketId: socket.current.id });
      streamReadyNotifiedRef.current = true;
    }
  }, [localStream, roomId, socket]);

  // Process pending peers when local stream becomes available
  const processPendingPeers = useCallback(async (stream) => {
    if (pendingPeersRef.current.length > 0 && stream) {
      console.log("Processing pending peers with local stream:", pendingPeersRef.current);
      
      // Add delay to ensure peers are ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const peers = [...pendingPeersRef.current];
      pendingPeersRef.current = [];
      
      for (const { peerId, rId } of peers) {
        await createPeerConnectionAndOffer(peerId, rId, stream);
      }
    }
  }, [createPeerConnectionAndOffer]);

  // Socket event handlers
  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;

    const onExistingPeers = async ({ roomId: rId, peers }) => {
      console.log("Existing peers in room:", peers);
      console.log("I am call starter:", isCallStarter);
      console.log("Current local stream:", localStream);
      
      if (!localStream) {
        console.log("No local stream yet, storing peers for later processing");
        pendingPeersRef.current = peers.map(({ socketId }) => ({ peerId: socketId, rId }));
        return;
      }
      
      // If I'm the call starter, wait a bit longer for peers to be ready
      if (isCallStarter && peers.length > 0) {
        console.log("As call starter, creating offers to existing peers with delay");
        setTimeout(async () => {
          for (const { socketId: peerId } of peers) {
            await createPeerConnectionAndOffer(peerId, rId, localStream);
          }
        }, 3000); // Increased delay for call starter
      }
    };

    const onUserJoined = async ({ roomId: rId, socketId: peerId }) => {
      console.log("User joined room:", peerId);
      console.log("Current local stream:", localStream);
      
      if (!localStream) {
        console.log("No local stream yet, storing peer for later processing");
        pendingPeersRef.current.push({ peerId, rId });
        return;
      }
      
      // Wait for the new joiner to get their stream ready
      console.log("Creating offer to new joiner with delay:", peerId);
      setTimeout(async () => {
        await createPeerConnectionAndOffer(peerId, rId, localStream);
      }, 2000);
    };

    const onStreamReady = async ({ roomId: rId, socketId: readySocketId }) => {
      console.log("Peer stream ready:", readySocketId);
      
      // If we have a local stream and this peer is ready, create offer to them
      if (localStream && readySocketId !== s.id) {
        console.log("Creating offer to stream-ready peer:", readySocketId);
        await createPeerConnectionAndOffer(readySocketId, rId, localStream);
      }
    };

    const onOffer = async ({ from, roomId: rId, description }) => {
      console.log("Received offer from:", from);
      try {
        const pc = await ensurePeerConnection(from, localStream);
        await pc.setRemoteDescription(new RTCSessionDescription(description));
        
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        s.emit("webrtc:answer", {
          to: from,
          from: s.id,
          roomId: rId,
          description: pc.localDescription,
        });
        console.log("Sent answer to:", from);
        pendingOffersRef.current.delete(from);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const onAnswer = async ({ from, description }) => {
      console.log("Received answer from:", from);
      try {
        const pc = pcMapRef.current.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(description));
          console.log("Set remote description for answer from:", from);
          pendingOffersRef.current.delete(from);
        } else {
          console.error("No peer connection found for:", from);
        }
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const onIce = async ({ from, candidate }) => {
      try {
        const pc = pcMapRef.current.get(from);
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added ICE candidate from:", from);
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    const onUserLeft = ({ socketId }) => {
      console.log("User left:", socketId);
      const pc = pcMapRef.current.get(socketId);
      if (pc) {
        pc.close();
        pcMapRef.current.delete(socketId);
      }
      removeRemoteStream(socketId);
      pendingOffersRef.current.delete(socketId);
      pendingPeersRef.current = pendingPeersRef.current.filter(p => p.peerId !== socketId);
    };

    const onIncomingCall = (payload) => {
      console.log("Incoming call:", payload);
      setIncomingCall(payload);
    };

    const onCallEnded = () => {
      console.log("Call ended by remote");
      endCall();
    };

    s.on("webrtc:existing-peers", onExistingPeers);
    s.on("webrtc:user-joined", onUserJoined);
    s.on("webrtc:stream-ready", onStreamReady);
    s.on("webrtc:offer", onOffer);
    s.on("webrtc:answer", onAnswer);
    s.on("webrtc:ice-candidate", onIce);
    s.on("webrtc:user-left", onUserLeft);
    s.on("webrtc:incoming-call", onIncomingCall);
    s.on("webrtc:call-ended", onCallEnded);

    return () => {
      s.off("webrtc:existing-peers", onExistingPeers);
      s.off("webrtc:user-joined", onUserJoined);
      s.off("webrtc:stream-ready", onStreamReady);
      s.off("webrtc:offer", onOffer);
      s.off("webrtc:answer", onAnswer);
      s.off("webrtc:ice-candidate", onIce);
      s.off("webrtc:user-left", onUserLeft);
      s.off("webrtc:incoming-call", onIncomingCall);
      s.off("webrtc:call-ended", onCallEnded);
    };
  }, [socket, localStream, isCallStarter, ensurePeerConnection, createPeerConnectionAndOffer, removeRemoteStream]);

  // Notify about stream readiness when local stream is available
  useEffect(() => {
    if (localStream && inCall) {
      notifyStreamReady();
      
      // Process any pending peers
      if (pendingPeersRef.current.length > 0) {
        console.log("Local stream available, processing pending peers");
        processPendingPeers(localStream);
      }
    }
  }, [localStream, inCall, notifyStreamReady, processPendingPeers]);

  // Functions
  const joinRoom = useCallback(async (rId, starter = false) => {
    try {
      console.log("Joining room:", rId, "as starter:", starter);
      setRoomId(rId);
      setIsCallStarter(starter);
      streamReadyNotifiedRef.current = false; // Reset notification flag
      
      // Get local stream first
      const stream = await ensureLocalStream();
      console.log("Local stream ready, joining room");
      
      if (socket?.current) {
        socket.current.emit("webrtc:join-room", { roomId: rId, user: me });
        setInCall(true);
        console.log("Successfully joined room and set inCall to true");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomId(null);
      setInCall(false);
      setIsCallStarter(false);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  }, [ensureLocalStream, socket, me]);

  const startCall = useCallback((rId) => {
    console.log("Starting call for room:", rId);
    joinRoom(rId, true).then(() => {
      if (socket?.current) {
        console.log("Emitting start-call event");
        socket.current.emit("webrtc:start-call", { roomId: rId, fromUser: me });
      }
    }).catch(error => {
      console.error("Error starting call:", error);
    });
  }, [joinRoom, socket, me]);

  const acceptCall = useCallback((payload) => {
    console.log("Accepting call:", payload);
    setIncomingCall(null);
    joinRoom(payload.roomId, false); // Not the call starter
  }, [joinRoom]);

  const declineCall = useCallback(() => {
    console.log("Declining call");
    setIncomingCall(null);
  }, []);

  const leaveRoom = useCallback(() => {
    if (!roomId || !socket?.current) return;
    console.log("Leaving room:", roomId);
    socket.current.emit("webrtc:leave-room", { roomId });
  }, [roomId, socket]);

  const endCall = useCallback(() => {
    console.log("Ending call");
    
    // Close all peer connections
    for (const pc of pcMapRef.current.values()) {
      try {
        pc.close();
      } catch (error) {
        console.error("Error closing peer connection:", error);
      }
    }
    pcMapRef.current.clear();
    pendingOffersRef.current.clear();
    pendingPeersRef.current = [];
    streamReadyNotifiedRef.current = false;

    // Stop local media
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }

    // Clear remote streams
    setRemoteStreams(new Map());

    // Notify peers if we're in a room
    if (roomId && socket?.current) {
      socket.current.emit("webrtc:end-call", { roomId });
    }
    
    setInCall(false);
    setRoomId(null);
    setIncomingCall(null);
    setIsCallStarter(false);
  }, [localStream, roomId, socket]);

  // Media controls
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
        console.log("Audio track enabled:", track.enabled);
      });
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
        console.log("Video track enabled:", track.enabled);
      });
    }
  }, [localStream]);

  const shareScreen = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const videoTrack = displayStream.getVideoTracks()[0];

      // Replace the video track in each peer connection
      pcMapRef.current.forEach((pc) => {
        const sender = pc.getSenders().find(
          (s) => s.track && s.track.kind === "video"
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      videoTrack.onended = () => {
        // Restore camera when sharing stops
        const cameraTrack = localStream?.getVideoTracks()[0];
        if (cameraTrack) {
          pcMapRef.current.forEach((pc) => {
            const sender = pc.getSenders().find(
              (s) => s.track && s.track.kind === "video"
            );
            if (sender) {
              sender.replaceTrack(cameraTrack);
            }
          });
        }
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }, [localStream]);

  const value = {
    inCall,
    roomId,
    incomingCall,
    localStream,
    remoteStreams,
    isCallStarter,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    toggleAudio,
    toggleVideo,
    shareScreen,
    joinRoom,
    leaveRoom,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}