import React from 'react'
import { useContext } from 'react'
import { styled, Box, Typography } from "@mui/material";

import { AccountContext } from '../../ContextApi/AccountProvide'
import SendfriendRequest from './SendfriendRequest';

function AllUsers({user}) {

    const {account, localAccount} = useContext(AccountContext)
    const profilePicture = user?.picture || user?.profilePhoto;
  return (
    <div className='user-info' >


        <div>
            <img src={profilePicture} alt="dp-user" />
        </div>
        <div style={{ width: '100%'}}>

            <div className='container'>
                <div>{user.name}</div>
            </div>

        </div>
        <SendfriendRequest senderId={localAccount._id} recipientId={user._id } />
    </div>
  )
}

export default AllUsers