import { createContext, useEffect, useRef, useState } from "react";

import {io} from 'socket.io-client'

export const AccountContext = createContext(null)

const AccountProvider = ({children}) => {
    const [account, setAccount] = useState()
    const [person, setPerson] = useState({})
    const [activeUser, setActiveUser] = useState([])
    const [newMessageFlag, setNewMessageFlage] = useState(false)
    const [localAccount, setLocalAccount] = useState(null);
    const [selectedLang, setSelectedLang] = useState(""); 
      
    const socket = useRef()

    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        // socket.current = io('wss://chatspark-real-time-chat-app-api.onrender.com');
    }, [])

    useEffect(() => {
        const storedAccount = localStorage.getItem("localAccount");
        if (storedAccount) {
            setLocalAccount(JSON.parse(storedAccount));
        }
    }, []);

    useEffect(() => {
        if (localAccount) {
            localStorage.setItem("localAccount", JSON.stringify(localAccount));
        } else {
            localStorage.removeItem("localAccount"); // optional cleanup
        }
    }, [localAccount]);

    const logout = () => {
        setAccount(null);
        setPerson({});
        setLocalAccount(null); 
        setActiveUser([]);
        socket.current?.disconnect();
    };


    return (
        <AccountContext.Provider
            value={{
                account, setAccount,
                localAccount, setLocalAccount,
                person, setPerson,
                newMessageFlag, setNewMessageFlage,
                socket,
                activeUser, setActiveUser,
                logout,
                setSelectedLang, selectedLang
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider