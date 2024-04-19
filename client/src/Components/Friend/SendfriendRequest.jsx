import React from "react";
import { useState } from "react";

import { sendrequestforFriend } from "../../Service/api";

function SendfriendRequest({ senderId, recipientId }) {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send Friend Request");
  const [buttonColor, setButtonColor] = useState("#007bff");

  const sendRequest = async () => {
    try {
      setLoading(true);
      await sendrequestforFriend({ senderId, recipientId });
      setButtonText("Friend Request Sent");
      setButtonColor("#28a745");
    } catch (error) {
      console.error(error);
      setButtonText("Error Sending Request");
      setButtonColor("#dc3545");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={sendRequest} disabled={loading} style={{ backgroundColor: buttonColor }}>
      {loading ? "Sending request..." : buttonText}
    </button>
  );
}

export default SendfriendRequest;
