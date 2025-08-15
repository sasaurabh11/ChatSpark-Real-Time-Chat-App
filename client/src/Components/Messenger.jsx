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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          
          <div className="w-full max-w-md mt-8 p-8 bg-gray-800 rounded-lg shadow-xl">
            <LoginBox />
          </div>
          
          <footer className="mt-12 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Messenger. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  )
}

export default Messenger