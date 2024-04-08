import React, { useContext, useState, useEffect } from 'react'
import './UserConversation.css'
import { styled, Box, Typography } from "@mui/material";
import { AccountContext } from '../../../ContextApi/AccountProvide'

import { formatDate } from '../../../Utills/commonUtills'

import { setConversation, getConversation } from '../../../Service/api'

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

  const { setPerson, account, newMessageFlag } = useContext(AccountContext)

  const [message, setMessage] = useState({});

  useEffect(() => {
    const getConversationMessage = async() => {
        const data = await getConversation({ senderId: account.sub, receiverId: user.sub });
        setMessage({ text: data?.message, timestamp: data?.updatedAt });
    }
    getConversationMessage();
}, [newMessageFlag]);

  const getUser = async () => {
    setPerson(user)
    await setConversation({senderId : account.sub, receverId : user.sub})
  }

  return (
    <div className='user-info' onClick={() => getUser()}>
        <div>
            <img src={user.picture} alt="dp-user" />
        </div>
        <div style={{ width: '100%'}}>
            <div className='container'>
                <div>{user.name}</div>
                {
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