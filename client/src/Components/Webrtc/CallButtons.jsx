import React, { useContext, useState } from "react";
import { CallContext } from "../../ContextApi/CallProvider";

export default function CallButtons() {
  const { startCall, joinRoom, inCall, roomId } = useContext(CallContext);
  const [testRoomId, setTestRoomId] = useState("test-room-123");

  const handleStartCall = () => {
    if (!testRoomId.trim()) {
      alert("Please enter a room ID");
      return;
    }
    console.log("Starting call with room ID:", testRoomId);
    startCall(testRoomId);
  };

  const handleJoinRoom = () => {
    if (!testRoomId.trim()) {
      alert("Please enter a room ID");
      return;
    }
    console.log("Joining room:", testRoomId);
    joinRoom(testRoomId);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-700 rounded-t-lg border-b border-gray-600">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleStartCall}
          disabled={inCall}
          className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Start Call
        </button>

        <button
          onClick={handleJoinRoom}
          disabled={inCall}
          className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Join Call
        </button>
      </div>

      {inCall && (
        <div className="px-3 py-1 text-xs bg-green-900 text-green-100 rounded-lg">
          In Call: {roomId}
        </div>
      )}
    </div>
  );
}