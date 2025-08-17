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
    <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 shadow-sm">
      {/* Left side - User info */}
      <div className="flex items-center min-w-0">
        <div className="relative flex-shrink-0 mr-2">
          <img 
            src={personPhoto} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border border-gray-600"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-gray-800 ${
            isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
        </div>
        
        <div className="min-w-0">
          <h3 className="font-medium text-white text-sm truncate">
            {person?.name}
          </h3>
          <p className={`text-[11px] font-medium ${
            isActive ? 'text-green-400' : 'text-gray-400'
          }`}>
            {isActive ? (
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                Online
              </span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-1">
        <CallButtons className="hidden xs:flex" />
        
        <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
          <Search className="text-base" />
        </button>
        <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
          <MoreVert className="text-base" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;