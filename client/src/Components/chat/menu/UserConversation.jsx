import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import { setConversation, getConversation } from '../../../Service/api';
import { formatDate } from '../../../Utills/commonUtills';

function UserConversation({ user }) {
    const { setPerson, account, newMessageFlag, localAccount, activeUser, person } = useContext(AccountContext);
    const [message, setMessage] = useState({});
    const profilePicture = user?.picture || user?.profilePhoto;
    const accountValue = account?.sub || localAccount?._id;
    const isOwnMessage = accountValue === message?.senderId;

    useEffect(() => {
        const getConversationMessage = async() => {
            const recieveid = user.sub || user._id;
            const sendid = localAccount?._id || account?.sub;
            const data = await getConversation({ senderId: sendid, receiverId: recieveid });
            setMessage({
                text: data?.message,
                translatedText: data?.translatedText,
                senderId: data?.senderId,
                timestamp: data?.updatedAt
            });
        };
        getConversationMessage();
    }, [newMessageFlag]);

    const getUser = async () => {
        const recieveid = user?.sub || user?._id;
        const sendid = localAccount?._id || account?.sub;
        await setConversation({ senderId: sendid, receverId: recieveid });
        setPerson(user);
    };

    return (
        <div 
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            onClick={getUser}
        >
            <div className="relative mr-3">
                <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium truncate">{user.name}</h3>
                    {message?.text && (
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {formatDate(message?.timestamp)}
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-400 truncate">
                    {message?.text?.includes('localhost')
                        ? '📷 Media'
                        : isOwnMessage
                            ? message?.text
                            : message?.translatedText || message?.text || 'Start a new conversation'}
                </p>

            </div>
        </div>
    );
}

export default UserConversation;