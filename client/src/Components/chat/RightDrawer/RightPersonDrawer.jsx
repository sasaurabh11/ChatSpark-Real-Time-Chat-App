import React from 'react';
import { useContext } from 'react';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import { Divider, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import CallButtons from '../../Webrtc/CallButtons';

function RightPersonDrawer({ onClose }) {
    const { person } = useContext(AccountContext);
    const profilePicture = person?.picture || person?.profilePhoto;

    return (
        <div className="hidden md:flex flex-col w-full h-full bg-gray-800 text-gray-100 overflow-y-auto">
            {/* Close button for mobile (hidden on desktop) */}
            <div className="md:hidden absolute top-4 right-4 z-10">
                <IconButton onClick={onClose} className="text-gray-300 hover:bg-gray-700">
                    <Close />
                </IconButton>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center py-8 px-4 border-b border-gray-700 relative">
                <div className="relative mb-4 group">
                    <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-500/30 transition-all duration-300 group-hover:border-indigo-500/60"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-500/20 transition-all duration-300 pointer-events-none"></div>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-white text-center px-2">
                    {person?.name}
                </h2>
                <p className="text-gray-400 mt-1 text-sm md:text-base">
                    {person?.email}
                </p>
            </div>

            {/* Profile Info */}
            <div className="p-4 md:p-6">
                <div className="mb-4">
                    <p className="text-xs md:text-sm text-gray-400 mb-1">About</p>
                    <p className="text-gray-300 text-sm md:text-base">
                        {person?.about || "Hey there! I'm using ChatSpark"}
                    </p>
                </div>

                <Divider className="bg-gray-700 my-4" />

                <div className="mb-4">
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Joined</p>
                    <p className="text-gray-300 text-sm md:text-base">
                        {new Date(person?.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                <Divider className="bg-gray-700 my-4" />

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-indigo-500/20">
                        Message
                    </button>
                    <div className="flex justify-center">
                        <CallButtons compact />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-700/30 p-4 md:p-6 mt-auto">
                <p className="text-xs text-gray-400 text-center">
                    This name will be visible to your ChatSpark contacts.
                </p>
            </div>
        </div>
    );
}

export default RightPersonDrawer;