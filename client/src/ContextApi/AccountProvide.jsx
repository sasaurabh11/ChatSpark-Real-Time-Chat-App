import { createContext, useEffect, useRef, useState } from "react";

import {io} from 'socket.io-client'

export const AccountContext = createContext(null)

const AccountProvider = ({children}) => {
    const [account, setAccount] = useState()
    const [person, setPerson] = useState({})
    const [activeUser, setActiveUser] = useState([])
    const [newMessageFlag, setNewMessageFlage] = useState(false)
    const [localAccount, setLocalAccount] = useState();
      
    const socket = useRef()

    useEffect(() => {
        // socket.current = io('ws://localhost:8000');
        socket.current = io('wss://chatspark-real-time-chat-app-api.onrender.com');
    }, [])

    return (
        <AccountContext.Provider
            value={{
                account, setAccount,
                localAccount, setLocalAccount,
                person, setPerson,
                newMessageFlag, setNewMessageFlage,
                socket,
                activeUser, setActiveUser
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider