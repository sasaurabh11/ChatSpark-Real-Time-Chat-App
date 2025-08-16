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

function LeftIcons({ toggleMenu }) {
  const { account, localAccount } = useContext(AccountContext);
  const [drawer, setDrawer] = useState(false);

  const profilePicture = account?.picture || localAccount?.profilePhoto;

  return (
    <div className="left-design">
      <div className="upper-left-design">
        <div onClick={toggleMenu} className="cursor-pointer flex flex-col items-center">
          <WhatsAppIcon />
          <p style={{ marginTop: "-3px" }}>Chats</p>
        </div>

        <NavLink to="/add-friends" className="flex flex-col items-center">
          <PersonAddIcon />
          <p style={{ marginTop: "-3px" }}>Users</p>
        </NavLink>

        <div className="flex flex-col items-center">
          <CallIcon />
          <p style={{ marginTop: "-3px" }}>Calls</p>
        </div>
      </div>

      <div className="lower-left-design">
        <NavLink to="/notifications" className="flex flex-col items-center">
          <CircleNotificationsIcon />
          <p style={{ marginTop: "-3px" }}>Updates</p>
        </NavLink>

        <div className="flex flex-col items-center">
          <SettingsIcon />
          <p style={{ marginTop: "-3px" }}>Setting</p>
        </div>

        {profilePicture && (
          <img
            src={profilePicture}
            alt="dp"
            onClick={() => setDrawer(!drawer)}
            className="cursor-pointer w-8 h-8 rounded-full"
          />
        )}
        <InfoDrawer open={drawer} setOpen={setDrawer} />
      </div>
    </div>
  );
}

export default LeftIcons