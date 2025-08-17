import { Dialog } from "@mui/material";
import Menu from "./menu/Menu";
import Emptychat from "./chat/Emptychat";
import LeftIcons from "./leftIcons/LeftIcons";
import RightPersonDrawer from "./RightDrawer/RightPersonDrawer";
import ChatUser from "./chat/ChatUser";
import { useContext, useState } from "react";
import { AccountContext } from "../../ContextApi/AccountProvide";

function Chatbox() {
  const { person } = useContext(AccountContext);
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="fixed inset-0 flex bg-gray-900 text-gray-100 overflow-hidden">
      {/* Left Icons Sidebar */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 flex-shrink-0">
        <LeftIcons toggleMenu={() => setShowMenu((prev) => !prev)} />
      </div>

      {/* Menu/Contacts Section */}
      {showMenu && (
        <div className="absolute inset-y-0 left-16 w-64 bg-gray-800 border-r border-gray-700 flex-col flex-shrink-0 z-20 md:static md:w-80">
          <Menu setShowMenu={setShowMenu} />
        </div>
      )}

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