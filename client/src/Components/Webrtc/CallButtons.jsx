import React, { useContext } from 'react';
import { CallContext } from '../../ContextApi/CallProvider';

export default function CallButtons({ conversation }) {
  const { startCall, joinRoom, inCall } = useContext(CallContext);
  const roomId = conversation?._id; // Use your conversation ID

  if (!roomId) return null;

  return (
    <div className="flex gap-2">
      <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white" onClick={() => startCall(roomId)} disabled={inCall}>Start Call</button>
      <button className="px-3 py-1.5 rounded-xl bg-gray-700 text-white" onClick={() => joinRoom(roomId)} disabled={inCall}>Join Ongoing</button>
    </div>
  );
}