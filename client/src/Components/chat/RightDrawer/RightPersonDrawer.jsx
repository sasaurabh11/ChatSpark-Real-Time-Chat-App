import React from 'react';
import { useContext } from 'react';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import { Divider } from "@mui/material";

function RightPersonDrawer() {
    const { person } = useContext(AccountContext);
    const profilePicture = person?.picture || person?.profilePhoto;

    return (
        <div className="w-full h-full bg-gray-800 text-gray-100 overflow-y-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center py-8 px-4 border-b border-gray-700">
                <div className="relative mb-4">
                    <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500/30"
                    />
                </div>
                <h2 className="text-2xl font-semibold text-white">{person?.name}</h2>
                <p className="text-gray-400 mt-1">{person?.email}</p>
            </div>

            {/* Profile Info */}
            <div className="p-6">
                <div className="mb-2">
                    <p className="text-sm text-gray-400 mb-1">About</p>
                    <p className="text-gray-300">
                        {person?.about || "Hey there! I'm using ChatSpark"}
                    </p>
                </div>


                <Divider className="bg-gray-700 my-4" />

                <div className="mb-2 mt-6">
                    <p className="text-sm text-gray-400 mb-1">Joined</p>
                    <p className="text-gray-300">
                        {new Date(person?.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                </div>

                <Divider className="bg-gray-700 my-4" />

                <div className="flex space-x-4 pt-6">
                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Message
                    </button>
                    <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        Call
                    </button>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-700/50 p-6 mt-10">
                <p className="text-xs text-gray-400">
                    This name will be visible to your ChatSpark contacts.
                </p>
            </div>
        </div>
    );
}

export default RightPersonDrawer;