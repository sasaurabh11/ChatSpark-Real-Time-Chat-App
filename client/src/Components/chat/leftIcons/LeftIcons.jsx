import React, { useContext, useState } from 'react';

import InfoDrawer from '../../drawer/InfoDrawer';
import './LeftIcons.css'

import SettingsIcon from '@mui/icons-material/Settings';
import ArchiveIcon from '@mui/icons-material/Archive';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

import { AccountContext } from '../../../ContextApi/AccountProvide';
import { NavLink } from 'react-router-dom';

function LeftIcons() {
  const { account,  localAccount} = useContext(AccountContext);

  const [drawer, setDrawer] = useState(false);

  const handleDrawer = () => {
    setDrawer(!drawer) 
  }

  const profilePicture = account?.picture || localAccount?.profilePhoto;

  return (
    <div>
        {/* {profilePicture && ( 
          <img src={profilePicture} alt="dp" onClick={handleDrawer} />
        )}

        <InfoDrawer open = {drawer} setOpen = {setDrawer}/> */}

        <div className='left-design'>

          <div className='upper-left-design'>
            <WhatsAppIcon/>
              <p style={{marginTop: '-3px'}}>Chats</p>
              <NavLink
                to='/add-friends'
              >
                <PersonAddIcon />
              </NavLink>
              <p style={{marginTop: '-3px'}}>Users</p>

              <CallIcon/>
              <p style={{marginTop: '-3px'}}>Calls</p>
              {/* <DataSaverOffIcon/> */}
          </div>

          <div className='lower-left-design'>

              {/* <StarOutlineIcon/> */}
              <NavLink
                to='/notifications'
              >
                  <CircleNotificationsIcon/>
              </NavLink>
              <p style={{marginTop: '-3px'}}>Updates</p>

              {/* <ArchiveIcon/> */}
              <SettingsIcon/>
              <p style={{marginTop: '-3px'}}>Setting</p>

              {profilePicture && ( 
                <img src={profilePicture} alt="dp" onClick={handleDrawer} />
              )}


              <InfoDrawer open = {drawer} setOpen = {setDrawer}/>

          </div>
        </div>
    </div>
  )
}

export default LeftIcons