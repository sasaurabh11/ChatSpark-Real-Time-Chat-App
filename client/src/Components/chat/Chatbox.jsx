import { Dialog } from "@mui/material";
import Menu from "./menu/Menu";
import Emptychat from "./chat/Emptychat";
import LeftIcons from "./leftIcons/LeftIcons";
import RightPersonDrawer from "./RightDrawer/RightPersonDrawer";
import { useContext } from "react";
import { AccountContext } from "../../ContextApi/AccountProvide";
import ChatUser from "./chat/ChatUser";

function Chatbox() {
  const { person } = useContext(AccountContext);

  return (
    // Remove Dialog and use a fixed positioned div instead
    <div className="fixed inset-4 flex bg-gray-900 text-gray-100 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
      {/* Left Icons Sidebar */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 flex-shrink-0">
        <LeftIcons />
      </div>

      {/* Menu/Contacts Section */}
      <div className="hidden md:flex w-80 bg-gray-800 border-r border-gray-700  flex-col flex-shrink-0">
        <Menu />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900 min-w-0">
        {Object.keys(person).length ? (
          <ChatUser />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Emptychat />
          </div>
        )}
      </div>

      {/* Right Drawer (when person is selected) */}
      {Object.keys(person).length > 0 && (
        <div className="hidden md:flex w-72 bg-gray-800 border-l border-gray-700 flex-shrink-0">
          <RightPersonDrawer />
        </div>
      )}
    </div>
  );
}

export default Chatbox;
