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
    <Dialog
      open={true}
      PaperProps={{
        sx: {
          height: "95vh",
          width: "95vw",
          maxWidth: "1800px",
          maxHeight: "95vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#111827",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        },
      }}
      hideBackdrop={true}
      maxWidth={"md"}
    >
      <div className="flex h-full bg-gray-900 text-gray-100">
        {/* Left Icons Sidebar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
          <LeftIcons />
        </div>

        {/* Menu/Contacts Section */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <Menu />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
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
          <div className="w-72 bg-gray-800 border-l border-gray-700">
            <RightPersonDrawer />
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default Chatbox;
