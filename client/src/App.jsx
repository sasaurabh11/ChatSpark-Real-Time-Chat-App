import Messenger from "./Components/Messenger";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountProvider from "./ContextApi/AccountProvide";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatbox from "./Components/chat/Chatbox";
import SendrequestUI from "./Components/Friend/SendrequestUI";
import RequestNotification from "./Components/Friend/RequestNotification";
import Friend from "./Components/Friend/Friend";

function App() {
  const clientid = import.meta.env.VITE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientid}>
      <AccountProvider>
        <BrowserRouter>
          {/* Fixed background div that wraps all content */}
          <div className="fixed inset-0 bg-gray-900 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Messenger />} />
              <Route path="/add-friends" element={<Friend />} />
              <Route path="/notifications" element={<RequestNotification />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AccountProvider>
    </GoogleOAuthProvider>
  );
}

export default App;