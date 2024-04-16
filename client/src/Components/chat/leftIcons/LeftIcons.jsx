import React, { useContext, useState } from 'react';

import InfoDrawer from '../../drawer/InfoDrawer';
import './LeftIcons.css'

import SettingsIcon from '@mui/icons-material/Settings';
import ArchiveIcon from '@mui/icons-material/Archive';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';

import { AccountContext } from '../../../ContextApi/AccountProvide';

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
              <CallIcon/>
              <DataSaverOffIcon/>
          </div>

          <div className='lower-left-design'>

              <StarOutlineIcon/>
              <ArchiveIcon/>
              <SettingsIcon/>

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