import React, { useContext, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/InfoDrawer';

function Header() {
  const { account, localAccount } = useContext(AccountContext);
  const [drawer, setDrawer] = useState(false);
  const profilePicture = account?.picture || localAccount?.profilePhoto;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-4">
        {profilePicture && (
          <div className="relative">
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-600 hover:border-indigo-500 transition-all"
              onClick={() => setDrawer(true)}
            />
          </div>
        )}
        <h2 className="text-xl font-semibold text-white">Chats</h2>
      </div>
      
      <div className="flex items-center space-x-4 text-gray-400">
        <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <ChatIcon className="text-gray-300 hover:text-indigo-400" />
        </button>
        <HeaderMenu setdrawer={setDrawer} />
      </div>

      <InfoDrawer open={drawer} setOpen={setDrawer} />
    </div>
  );
}

export default Header;