import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import LoginBox from "./account/LoginBox"
import { AppBar, Toolbar, styled } from "@mui/material"
import Chatbox from "./chat/Chatbox"
import { useContext } from "react"
import { AccountContext } from "../ContextApi/AccountProvide"

const Messenger = () => {
  const { account, localAccount } = useContext(AccountContext);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {account || localAccount ? (
        // Chat Interface
        <div className="flex flex-col flex-1">          
          <div className="flex-1 overflow-hidden">
            <Chatbox />
          </div>
        </div>
      ) : (
        // Login Interface
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center p-4">
            <LoginBox />
          </div>
          <footer className="py-4 text-gray-500 text-sm text-center">
            <p>© {new Date().getFullYear()} Chatspark. Made with ❤️ by Saurabh.</p>
          </footer>
        </div>
      )}
    </div>
  )
}

export default Messenger