import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import LoginBox from "./account/LoginBox"
import {AppBar, Toolbar, styled} from "@mui/material"
import Chatbox from "./chat/Chatbox"
import './Messenger.css'

import { useContext } from "react"
import { AccountContext } from "../ContextApi/AccountProvide"

const LoginHeader = styled(AppBar) `
    height: 220px;
    background-color: #d2b48c;
`

const ChatHeader = styled(AppBar) `
    height: 130px;
    background-color: #e3c8a1;
` 

function Messenger() {
  const { account, localAccount } = useContext(AccountContext);

  return (
    // yaha pe check karke chatbox ko chalana hai ki user login hai ya nahi
    // context ki help se check karna hai
    <>
      {
          account || localAccount ? 
                // <NavLink
                //     to="/chats"
                // >
                    <div className="login-section">
                        <ChatHeader> 
                            <Toolbar>

                            </Toolbar>
                        </ChatHeader>

                        <Chatbox /> 
                    </div>
            //   </NavLink>
          :
              <div className="login-section">
                <LoginHeader>
                    <Toolbar>

                    </Toolbar>
                </LoginHeader>
                <LoginBox />
            </div>
      }
    </>
  )
}

export default Messenger