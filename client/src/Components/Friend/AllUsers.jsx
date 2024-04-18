import React from 'react'
import { useContext } from 'react'
import { styled, Box, Typography } from "@mui/material";
import './AllUsers.css'

import { AccountContext } from '../../ContextApi/AccountProvide'
import SendfriendRequest from './SendfriendRequest';

function AllUsers({user}) {

    const {account, localAccount} = useContext(AccountContext)
    const profilePicture = user?.picture || user?.profilePhoto;
    const senddvalue = localAccount?._id || account?.sub
    const uservalue = user.sub || user._id
    return (
        <div className='request-user-info' >

            <div>
                <img src={profilePicture} alt="dp-user" />
            </div>
            <div style={{ width: '100%'}}>

                <div className='container-request'>
                    <div>{user.name}</div>
                </div>

            </div>
            <SendfriendRequest senderId={senddvalue} recipientId={uservalue} />
        </div>
  )
}

export default AllUsers