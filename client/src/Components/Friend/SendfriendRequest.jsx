import React from "react";
import { useState } from "react";

import { sendrequestforFriend } from "../../Service/api";

function SendfriendRequest({ senderId, recipientId }) {
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {

      setLoading(true);
      await sendrequestforFriend({ senderId, recipientId });
      alert("Friend request sent successfully.");

    } catch (error) {

      console.error(error);
      alert("Error sending friend request.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={sendRequest} disabled={loading}>
      {loading ? "Sending request..." : "Send Friend Request"}
    </button>
  );
}

export default SendfriendRequest;
