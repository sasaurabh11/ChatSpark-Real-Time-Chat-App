import Messenger from "./Components/Messenger"
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'
import AccountProvider from "./ContextApi/AccountProvide";

function App() {
  const clientid = import.meta.env.VITE_CLIENT_ID || '';
  // const clientid = '669382865722-3jjfi26ko0sbscb8a05k5jtofl8shcin.apps.googleusercontent.com'

  return (
    <GoogleOAuthProvider clientId= {clientid} >
      <AccountProvider>
          <Messenger/>
      </AccountProvider>
    </GoogleOAuthProvider>
  )
}

export default App
