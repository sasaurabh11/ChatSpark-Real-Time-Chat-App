import React, { useContext, useEffect, useState, useRef } from "react";
import Footer from "./Footer";
import MessageSingle from "./MessageSingle";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { newMassage, getMessage } from "../../../Service/api";

function Messages({ person, conversation }) {
  const { account, localAccount, socket, newMessageFlag, setNewMessageFlage } =
    useContext(AccountContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [file, setFile] = useState(false);
  const scrollRef = useRef();

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    const messageHandler = (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    };

    socket.current.on("getMessage", messageHandler);
    return () => {
      socket.current.off("getMessage", messageHandler);
    };
  }, []);

  // Handle incoming messages
  useEffect(() => {
    if (
      incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId)
    ) {
      setMessages((prev) => [...prev, incomingMessage]);

      if (Notification.permission === "granted") {
        const senderName = person?.name || "Unknown User";
        new Notification(`New message from ${senderName}`, {
          body: incomingMessage.text,
          icon: person?.profilePhoto || "/default-profile.png",
        });
      }
    }
  }, [incomingMessage, conversation]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation messages
  useEffect(() => {
    const getMessageDetails = async () => {
      if (conversation?._id) {
        const data = await getMessage(conversation._id);
        setMessages(data);
      }
    };
    getMessageDetails();
  }, [person?._id, conversation?._id, newMessageFlag]);

  // Send message handler
  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if (code === 13 && value.trim()) {
      const accountValue = account?.sub || localAccount?._id;
      const personValue = person?.sub || person?._id;

      const message = {
        senderId: accountValue,
        receiverId: personValue,
        conversationId: conversation._id,
        type: file ? "file" : "text",
        text: file ? image : value,
      };

      socket.current.emit("sendMessage", message);
      await newMassage(message);

      setValue("");
      setFile(false);
      setImage("");
      setNewMessageFlage((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Message list */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? scrollRef : null}
          >
            <MessageSingle message={message} />
          </div>
        ))}
      </div>

      {/* Footer input */}
      <Footer
        sendText={sendText}
        setValue={setValue}
        value={value}
        setImage={setImage}
        setFile={setFile}
      />
    </div>
  );
}

export default Messages;
