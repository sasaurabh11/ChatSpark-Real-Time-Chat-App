import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { getConversation } from "../../../Service/api";

function ChatUser() {
  const { person, account, localAccount } = useContext(AccountContext);
  const [conversation, setConversation] = useState({});

  useEffect(() => {
    const getConversationDetails = async () => {
      const receiveId = person?.sub || person?._id;
      const sendId = localAccount?._id || account?.sub;

      if (receiveId && sendId) {
        const data = await getConversation({
          senderId: sendId,
          receiverId: receiveId,
        });
        setConversation(data);
      }
    };

    getConversationDetails();
  }, [person?.sub, person?._id]);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <ChatHeader person={person} />
      <div className="flex-1 min-h-0">
        <Messages person={person} conversation={conversation} />
      </div>
    </div>
  );
}

export default ChatUser;
