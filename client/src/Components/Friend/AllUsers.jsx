import React, { useContext } from 'react';
import { AccountContext } from '../../ContextApi/AccountProvide';
import SendfriendRequest from './SendfriendRequest';

function AllUsers({ user }) {
    console.log("user", user)
    const { account, localAccount } = useContext(AccountContext);
    const profilePicture = user?.picture || user?.profilePhoto;
    const senderId = localAccount?._id || account?.sub;
    const recipientId = user.sub || user._id;

    return (
        <div className="p-6">
            {/* User Card Content */}
            <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                    <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/30"
                    />
                    
                </div>
                
                {/* User Info */}
                <div className="w-full">
                    <h3 className="text-xl font-semibold text-white mb-1">{user.name}</h3>
                    {/* <p className="text-gray-400 mb-4">
                        {user.email || user.sub || 'ChatSpark user'}
                    </p> */}
                    
                    {/* Friend Request Button */}
                    <div className="mt-4">
                        <SendfriendRequest 
                            senderId={senderId} 
                            recipientId={recipientId} 
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllUsers;