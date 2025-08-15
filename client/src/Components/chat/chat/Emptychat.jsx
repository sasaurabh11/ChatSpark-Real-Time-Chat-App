import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

function Emptychat() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-900">
      <div className="mb-6 p-4 bg-gray-800 rounded-full">
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-indigo-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-3">Welcome to ChatSpark</h1>
      
      <p className="text-gray-400 mb-8 max-w-md">
        Looks like there are no messages here yet. Start chatting with your friends!
      </p>
      
      <NavLink
        to="/add-friends"
        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-indigo-500/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          <path fillRule="evenodd" d="M13 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        Start Chatting
      </NavLink>
    </div>
  );
}

export default Emptychat;