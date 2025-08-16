import React, { useContext } from "react";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { MoreVert, Search, Call, VideoCall } from "@mui/icons-material";
import CallButtons from "../../Webrtc/CallButtons";

function ChatHeader({ person }) {
  const { activeUser } = useContext(AccountContext);
  const personPhoto = person?.picture || person?.profilePhoto;

  const isActive = activeUser?.find(user => {
    if (user.sub && person.sub) return user.sub === person.sub;
    if (user._id && person._id) return user._id === person._id;
    return false;
  });

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 shadow-sm">
      {/* Left side - User info */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={personPhoto} 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${
            isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-lg">{person?.name}</h3>
          <p className={`text-xs font-medium ${
            isActive ? 'text-green-400' : 'text-gray-400'
          }`}>
            {isActive ? (
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                Online
              </span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>

      {/* Center - Call buttons */}
      <div className="flex items-center space-x-2">
        <CallButtons />
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105">
          <Search className="text-xl" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105">
          <MoreVert className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;