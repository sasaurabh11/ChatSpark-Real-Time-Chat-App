import React from 'react'
import { useState } from 'react';

import { acceptanceforfriendShip } from '../../Service/api';

function AcceptfriendRequest({requestId}) {
    const [loading, setLoading] = useState(false);

    const acceptRequest = async () => {
      try {
        setLoading(true);

        await acceptanceforfriendShip({ requestId })

        alert('Friend request accepted successfully.');

      } catch (error) {
        console.error(error);
        alert('Error accepting friend request.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button onClick={acceptRequest} disabled={loading}>
        {loading ? 'Accepting request...' : 'Accept Friend Request'}
      </button>
    );
}

export default AcceptfriendRequest