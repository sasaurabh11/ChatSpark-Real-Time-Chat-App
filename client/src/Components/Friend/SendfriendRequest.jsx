import React, { useState } from "react";
import { sendrequestforFriend } from "../../Service/api";

function SendfriendRequest({ senderId, recipientId }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'sent', 'error'

    const sendRequest = async () => {
        try {
            setLoading(true);
            await sendrequestforFriend({ senderId, recipientId });
            setStatus('sent');
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const getButtonConfig = () => {
        switch(status) {
            case 'sent':
                return {
                    text: 'Request Sent',
                    className: 'bg-green-600 hover:bg-green-700 text-white'
                };
            case 'error':
                return {
                    text: 'Error Occurred',
                    className: 'bg-red-600 hover:bg-red-700 text-white'
                };
            default:
                return {
                    text: 'Add Friend',
                    className: 'bg-indigo-600 hover:bg-indigo-700 text-white'
                };
        }
    };

    const { text, className } = getButtonConfig();

    return (
        <button
            onClick={sendRequest}
            disabled={loading || status === 'sent'}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${className} ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
            {loading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </span>
            ) : (
                text
            )}
        </button>
    );
}

export default SendfriendRequest;