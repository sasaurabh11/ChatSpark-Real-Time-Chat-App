import React, { useState, useContext } from 'react';
import { acceptanceforfriendShip } from '../../Service/api';
import { AccountContext } from '../../ContextApi/AccountProvide';

function AcceptfriendRequest({ requestId }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const { localAccount, account } = useContext(AccountContext);

  const acceptRequest = async () => {
    try {
      setStatus('loading');
      const recipientId = localAccount?._id || account?.sub;
      await acceptanceforfriendShip({ requestId, recipientId });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const getButtonConfig = () => {
    switch(status) {
      case 'success':
        return {
          text: 'Accepted',
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'error':
        return {
          text: 'Try Again',
          className: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'loading':
        return {
          text: 'Accepting...',
          className: 'bg-indigo-600 hover:bg-indigo-700 text-white opacity-75'
        };
      default:
        return {
          text: 'Accept Request',
          className: 'bg-indigo-600 hover:bg-indigo-700 text-white'
        };
    }
  };

  const { text, className } = getButtonConfig();

  return (
    <button
      onClick={acceptRequest}
      disabled={status === 'loading' || status === 'success'}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${className} ${
        status === 'loading' ? 'cursor-not-allowed' : ''
      }`}
    >
      {status === 'loading' ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {text}
        </span>
      ) : (
        text
      )}
    </button>
  );
}

export default AcceptfriendRequest;