import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';

import { useContext } from 'react';
import { AccountContext } from '../../../ContextApi/AccountProvide';
import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/InfoDrawer';

import './Header.css'

function Header() {
  const { account } = useContext(AccountContext);

  const [drawer, setDrawer] = useState(false);

  const handleDrawer = () => {
    setDrawer(!drawer)
  }

  return (
    <>
      <div className='header-design'>
        {/* dp correct karna padega */}
        <img src={account.picture} alt="dp" onClick={handleDrawer}/>

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
