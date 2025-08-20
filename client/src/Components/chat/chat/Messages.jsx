import React, { useContext, useEffect, useState, useRef } from "react";
import Footer from "./Footer";
import MessageSingle from "./MessageSingle";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { newMassage, getMessage } from "../../../Service/api";

function Messages({ person, conversation }) {
  const {
    account,
    localAccount,
    socket,
    newMessageFlag,
    setNewMessageFlage,
    selectedLang,
  } = useContext(AccountContext);
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

        setMessages((prev) => {
          const optimistic = prev.filter((m) => !m._id);
          return [...data, ...optimistic];
        });
      }
    };
    getMessageDetails();
  }, [person?._id, conversation?._id, newMessageFlag]);

  // Send message handler
  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if ((e.keyCode === 13 || e.which === 13 || e.type === 'click') && value.trim()) {
      console.log("here")
      const accountValue = account?.sub || localAccount?._id;
      const personValue = person?.sub || person?._id;
      
      const message = {
        senderId: accountValue,
        selectedLang: selectedLang,
        receiverId: personValue,
        conversationId: conversation._id,
        type: file ? "file" : "text",
        text: file ? image : value,
        createdAt: Date.now(),
        self: true,
      };

      setMessages((prev) => [...prev, message]);

      socket.current.emit("sendMessage", message);

      // Reset input
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
