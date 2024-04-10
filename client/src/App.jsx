import Messenger from "./Components/Messenger"
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'
import AccountProvider from "./ContextApi/AccountProvide";

function App() {
  const clientid = import.meta.env.VITE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId= {clientid} >
      <AccountProvider>
          <Messenger/>
      </AccountProvider>
    </GoogleOAuthProvider>
  )
}

export default App
