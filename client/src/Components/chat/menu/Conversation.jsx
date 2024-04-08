import React, { useContext, useEffect, useState } from 'react'
import { getUser } from '../../../Service/api'
import UserConversation from './UserConversation'

import './Conversation.css'

import {Divider} from '@mui/material'

import { AccountContext } from '../../../ContextApi/AccountProvide'

function Conversation({ text }) {

    const [users, setUser] = useState([])

    const { account, socket, setActiveUser } = useContext(AccountContext)

    useEffect(() => {
        const fetchData = async () => {
            let resopnse = await getUser();
            let filterData = resopnse.filter(user => user.name.toLowerCase().includes(text.toLowerCase()))
            setUser(filterData)
        }
        fetchData()
    }, [text])

    useEffect(() => {
        socket.current.emit('addUsers', account)
        socket.current.on('getUsers', users => {
            setActiveUser(users)
        })
    }, [account])

  return (
    <div className='AllUsers'>
        {
            users.map(user => (
                user.sub !== account.sub &&
                <>
                    <UserConversation user = {user}/>
                    <Divider/>
                </>
            ))
        }
    </div>

  ) 
}

export default Conversation