import React, { useContext } from "react";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { MoreVert, Search } from "@mui/icons-material";

function ChatHeader({ person }) {
  const { activeUser } = useContext(AccountContext);
  const personPhoto = person?.picture || person?.profilePhoto;

  const isActive = activeUser?.find(user => {
    if (user.sub && person.sub) return user.sub === person.sub;
    if (user._id && person._id) return user._id === person._id;
    return false;
  });

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={personPhoto} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          {isActive && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-white">{person?.name}</h3>
          <p className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
            {isActive ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-gray-400">
        <button className="p-1 rounded-full hover:bg-gray-600 transition-colors">
          <Search className="text-gray-300" />
        </button>
        <button className="p-1 rounded-full hover:bg-gray-600 transition-colors">
          <MoreVert className="text-gray-300" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;