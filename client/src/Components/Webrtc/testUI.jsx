import React, { useContext, useState } from 'react';
import { CallContext } from '../../ContextApi/CallProvider';

export default function CallTest() {
  const { startCall, joinRoom, inCall, roomId } = useContext(CallContext);
  const [testRoomId, setTestRoomId] = useState('test-room-123');

  const handleStartCall = () => {
    if (!testRoomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    console.log('Starting call with room ID:', testRoomId);
    startCall(testRoomId);
  };

  const handleJoinRoom = () => {
    if (!testRoomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    console.log('Joining room:', testRoomId);
    joinRoom(testRoomId);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Video Call Test</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Room ID:</label>
        <input
          type="text"
          value={testRoomId}
          onChange={(e) => setTestRoomId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter room ID"
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={handleStartCall}
          disabled={inCall}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Start Call
        </button>
        
        <button
          onClick={handleJoinRoom}
          disabled={inCall}
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Join Room (No Call)
        </button>
      </div>

      {inCall && (
        <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800">
            Currently in call - Room: {roomId}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Enter a room ID and click "Start Call" to initiate a call</li>
          <li>Other users can join with the same room ID</li>
          <li>Make sure camera/microphone permissions are granted</li>
          <li>Check browser console for debugging info</li>
        </ul>
      </div>
    </div>
  );
}