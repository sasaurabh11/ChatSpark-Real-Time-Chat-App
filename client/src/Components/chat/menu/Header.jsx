import React, { useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';

import { useContext } from 'react';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/InfoDrawer';

import './Header.css'

function Header() {
  const { account,  localAccount} = useContext(AccountContext);

  const [drawer, setDrawer] = useState(false);

  const handleDrawer = () => {
    setDrawer(!drawer) 
  }

  const profilePicture = account?.picture || localAccount?.profilePhoto;

  return (
    <>
      <div className='header-design'>

        {/* {profilePicture && ( 
          <img src={profilePicture} alt="dp" onClick={handleDrawer} />
        )} */}

        <h2>Chats</h2>

        <div className='Icons'>
          <ChatIcon/>
          <HeaderMenu setdrawer= {setDrawer}/>
        </div>

        <InfoDrawer open = {drawer} setOpen = {setDrawer}/>
      </div>
    </>
  );
}

export default Header;
