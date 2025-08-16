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
  const pcMapRef = useRef(new Map());
  const pendingOffersRef = useRef(new Set());

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
  const ensurePeerConnection = useCallback(async (peerSocketId) => {
    let pc = pcMapRef.current.get(peerSocketId);
    if (pc) return pc;

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
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log(`Adding ${track.kind} track to peer connection for:`, peerSocketId);
        pc.addTrack(track, localStream);
      });
    }

    pcMapRef.current.set(peerSocketId, pc);
    return pc;
  }, [localStream, socket, addRemoteStream, removeRemoteStream]);

  // Create offer
  const createPeerConnectionAndOffer = useCallback(async (peerSocketId, rId) => {
    if (!localStream || !socket?.current) {
      console.log("Cannot create offer - missing localStream or socket");
      return;
    }

    if (pendingOffersRef.current.has(peerSocketId)) {
      console.log("Offer already pending for:", peerSocketId);
      return;
    }

    try {
      console.log("Creating offer for:", peerSocketId);
      pendingOffersRef.current.add(peerSocketId);
      
      const pc = await ensurePeerConnection(peerSocketId);
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
  }, [localStream, socket, ensurePeerConnection]);

  // Socket event handlers
  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;

    const onExistingPeers = async ({ roomId: rId, peers }) => {
      console.log("Existing peers in room:", peers);
      if (!localStream) {
        console.log("No local stream yet, waiting...");
        return;
      }
      
      for (const { socketId: peerId } of peers) {
        await createPeerConnectionAndOffer(peerId, rId);
      }
    };

    const onUserJoined = async ({ roomId: rId, socketId: peerId }) => {
      console.log("User joined room:", peerId);
      if (!localStream) {
        console.log("No local stream yet, cannot create offer");
        return;
      }
      await createPeerConnectionAndOffer(peerId, rId);
    };

    const onOffer = async ({ from, roomId: rId, description }) => {
      console.log("Received offer from:", from);
      try {
        const pc = await ensurePeerConnection(from);
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
    s.on("webrtc:offer", onOffer);
    s.on("webrtc:answer", onAnswer);
    s.on("webrtc:ice-candidate", onIce);
    s.on("webrtc:user-left", onUserLeft);
    s.on("webrtc:incoming-call", onIncomingCall);
    s.on("webrtc:call-ended", onCallEnded);

    return () => {
      s.off("webrtc:existing-peers", onExistingPeers);
      s.off("webrtc:user-joined", onUserJoined);
      s.off("webrtc:offer", onOffer);
      s.off("webrtc:answer", onAnswer);
      s.off("webrtc:ice-candidate", onIce);
      s.off("webrtc:user-left", onUserLeft);
      s.off("webrtc:incoming-call", onIncomingCall);
      s.off("webrtc:call-ended", onCallEnded);
    };
  }, [socket, localStream, ensurePeerConnection, createPeerConnectionAndOffer, removeRemoteStream]);

  // When localStream is available, handle existing peers
  useEffect(() => {
    if (localStream && inCall && roomId) {
      console.log("Local stream ready, checking for existing peers to connect");
      // Re-emit join room to trigger peer connections
      socket?.current?.emit("webrtc:join-room", { roomId, user: me });
    }
  }, [localStream, inCall, roomId, socket, me]);

  // Functions
  const joinRoom = useCallback(async (rId) => {
    try {
      console.log("Joining room:", rId);
      setRoomId(rId);
      
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
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  }, [ensureLocalStream, socket, me]);

  const startCall = useCallback((rId) => {
    console.log("Starting call for room:", rId);
    joinRoom(rId).then(() => {
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
    joinRoom(payload.roomId);
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