import React, { useContext, useState, useEffect } from 'react'
import './UserConversation.css'
import { styled, Box, Typography } from "@mui/material";
import { AccountContext } from '../../../ContextApi/AccountProvide'

import { formatDate } from '../../../Utills/commonUtills'

import { setConversation, getConversation } from '../../../Service/api'
import SendfriendRequest from '../../Friend/SendfriendRequest';

const Timestamp = styled(Typography)`
    font-size: 12px;
    margin-left: auto;
    color: #00000099;
    margin-right: 20px;
`;

const Text = styled(Typography)`
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
`;

function UserConversation({user}) {

  const { setPerson, account, newMessageFlag, localAccount } = useContext(AccountContext)

  const [message, setMessage] = useState({});

  useEffect(() => {
        const getConversationMessage = async() => {
            const recieveid = user.sub || user._id 
            const sendid = localAccount?._id || account?.sub

            const data = await getConversation({ senderId: sendid, receiverId: recieveid });
            setMessage({ text: data?.message, timestamp: data?.updatedAt });
        }
      getConversationMessage();
  }, [newMessageFlag]);

  const getUser = async () => {
      
      const recieveid = user?.sub || user?._id 
      const sendid = localAccount?._id || account?.sub
      
      await setConversation({senderId : sendid, receverId : recieveid})
      setPerson(user)
  }  

  const profilePicture = user?.picture || user?.profilePhoto;

  return (
    <div className='user-info' onClick={() => getUser()}>

        {/* <SendfriendRequest senderId={localAccount._id} recipientId={user._id } /> */}

        <div>
            <img src={profilePicture} alt="dp-user" />
        </div>
        <div style={{ width: '100%'}}>

            <div className='container'>
                <div>{user.name}</div>
                {
                    // here I have to check
                    message?.text && 
                    <Timestamp>{formatDate(message?.timestamp)}</Timestamp>  
                }
            </div>

            <Box>
                    <Text>{message?.text?.includes('localhost') ? 'media' : message.text}</Text>
            </Box>
        </div>
    </div>
  )
}

export default UserConversation