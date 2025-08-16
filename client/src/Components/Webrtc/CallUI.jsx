import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CallContext } from '../../ContextApi/CallProvider';

function Video({ stream, muted, label }) {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const videoElement = ref.current;
    if (!videoElement) return;

    if (stream) {
      videoElement.srcObject = stream;
      console.log(`Setting stream for ${label}:`, stream.getTracks());
      
      const handlePlay = () => {
        console.log(`Video playing for ${label}`);
        setIsPlaying(true);
      };
      
      const handleError = (e) => {
        console.error(`Video error for ${label}:`, e);
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
      };
    } else {
      videoElement.srcObject = null;
      setIsPlaying(false);
    }
  }, [stream, label]);

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden h-64 md:h-80">
      <video 
        ref={ref} 
        autoPlay 
        playsInline 
        muted={muted} 
        className="w-full h-full object-cover" 
      />
      {!isPlaying && stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>Loading video...</div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
        {label} {!isPlaying && stream ? '(loading...)' : ''}
      </div>
      {/* Video track status indicator */}
      {stream && (
        <div className="absolute top-2 right-2 flex gap-1">
          {stream.getVideoTracks().length > 0 && (
            <div className={`w-2 h-2 rounded-full ${
              stream.getVideoTracks()[0]?.enabled ? 'bg-green-500' : 'bg-red-500'
            }`} title="Video" />
          )}
          {stream.getAudioTracks().length > 0 && (
            <div className={`w-2 h-2 rounded-full ${
              stream.getAudioTracks()[0]?.enabled ? 'bg-blue-500' : 'bg-red-500'
            }`} title="Audio" />
          )}
        </div>
      )}
    </div>
  );
}

export default function CallUI() {
  const {
    inCall,
    incomingCall,
    localStream,
    remoteStreams,
    acceptCall,
    declineCall,
    endCall,
    toggleAudio,
    toggleVideo,
    shareScreen,
  } = useContext(CallContext);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const remotes = useMemo(() => {
    const remotesArray = Array.from(remoteStreams.entries());
    console.log("Remote streams:", remotesArray.map(([id, stream]) => ({
      id,
      tracks: stream.getTracks().map(t => `${t.kind}: ${t.label}`)
    })));
    return remotesArray;
  }, [remoteStreams]);

  // Track audio/video state from local stream
  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const videoTracks = localStream.getVideoTracks();
      
      if (audioTracks.length > 0) {
        setIsAudioEnabled(audioTracks[0].enabled);
      }
      if (videoTracks.length > 0) {
        setIsVideoEnabled(videoTracks[0].enabled);
      }

      console.log("Local stream tracks:", {
        audio: audioTracks.map(t => `${t.label} (enabled: ${t.enabled})`),
        video: videoTracks.map(t => `${t.label} (enabled: ${t.enabled})`)
      });
    }
  }, [localStream]);

  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleShareScreen = async () => {
    try {
      await shareScreen();
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Failed to share screen");
    }
  };

  // Incoming call modal
  if (incomingCall && !inCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-gray-800 text-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-2">Incoming Call</h2>
          <p className="mb-2 text-gray-300">From: {incomingCall.fromUser?.name || 'Unknown'}</p>
          <p className="mb-6 text-gray-400">Would you like to join this call?</p>
          <div className="flex gap-3 justify-end">
            <button 
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors" 
              onClick={declineCall}
            >
              Decline
            </button>
            <button 
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition-colors" 
              onClick={() => acceptCall(incomingCall)}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active call panel
  if (!inCall) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid gap-4 h-full">
          {/* When no remote streams, show local stream larger */}
          {remotes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              {localStream ? (
                <div className="max-w-2xl w-full">
                  <Video 
                    stream={localStream} 
                    muted={true} 
                    label="You (waiting for others to join)" 
                  />
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="mb-4">Getting camera ready...</div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                </div>
              )}
            </div>
          ) : (
            /* Grid layout for multiple participants */
            <div className={`grid gap-4 h-full ${
              remotes.length === 1 ? 'grid-cols-1 md:grid-cols-2' :
              remotes.length <= 4 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {/* Local video */}
              {localStream && (
                <Video 
                  stream={localStream} 
                  muted={true} 
                  label="You" 
                />
              )}
              
              {/* Remote videos */}
              {remotes.map(([socketId, stream], index) => (
                <Video 
                  key={socketId}
                  stream={stream} 
                  muted={false}
                  label={`Participant ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Toggle */}
          <button 
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled 
                ? 'bg-gray-600 hover:bg-gray-500' 
                : 'bg-red-600 hover:bg-red-500'
            }`}
            onClick={handleToggleAudio}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              {isAudioEnabled ? (
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M15.293 2.293a1 1 0 011.414 1.414l-11 11a1 1 0 01-1.414-1.414l2.168-2.168A3 3 0 0110 7V4a3 3 0 00-6 0v4c0 .464.106.898.293 1.293L2.293 15.293a1 1 0 001.414 1.414l11-11zM10 15V7.414l1.293-1.293A3 3 0 0114 7v1a1 1 0 102 0V7a5 5 0 00-5-5z" clipRule="evenodd" />
              )}
            </svg>
          </button>

          {/* Video Toggle */}
          <button 
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled 
                ? 'bg-gray-600 hover:bg-gray-500' 
                : 'bg-red-600 hover:bg-red-500'
            }`}
            onClick={handleToggleVideo}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              {isVideoEnabled ? (
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              ) : (
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              )}
            </svg>
          </button>

          {/* Screen Share */}
          <button 
            className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
            onClick={handleShareScreen}
            title="Share screen"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 01-2 0V5H5v10h4a1 1 0 110 2H4a1 1 0 01-1-1V4zm7.707 4.293a1 1 0 00-1.414 1.414L10.586 11H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3z" clipRule="evenodd" />
            </svg>
          </button>

          {/* End Call */}
          <button 
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            onClick={endCall}
            title="End call"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Call Info */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        <div>Participants: {remotes.length + (localStream ? 1 : 0)}</div>
        {localStream && (
          <div className="text-xs text-gray-300 mt-1">
            Camera: {isVideoEnabled ? 'On' : 'Off'} | 
            Mic: {isAudioEnabled ? 'On' : 'Off'}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          Remote streams: {remotes.length}
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-1">Debug Info:</div>
          <div>Local Stream: {localStream ? 'Yes' : 'No'}</div>
          <div>Remote Streams: {remotes.length}</div>
          {remotes.map(([id, stream]) => (
            <div key={id} className="text-gray-300">
              {id.slice(0, 8)}: {stream.getTracks().length} tracks
            </div>
          ))}
        </div>
      )}
    </div>
  );
}