import React, { useContext } from 'react'
import { useState } from 'react';
import './AcceptfriendRequest.css'

import { acceptanceforfriendShip } from '../../Service/api';
import { AccountContext } from '../../ContextApi/AccountProvide';

function AcceptfriendRequest({requestId}) {
    const [loading, setLoading] = useState(false);

    const {localAccount, account} = useContext(AccountContext)

    const acceptRequest = async () => {
      try {
        setLoading(true);
        
        const recipientId = localAccount?._id || account?.sub;

        await acceptanceforfriendShip({ requestId, recipientId })

        alert('Friend request accepted successfully.');

      } catch (error) {
        console.error(error);
        alert('Error accepting friend request.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button onClick={acceptRequest} disabled={loading} className="custom-button">
        {loading ? 'Accepting request...' : 'Accept Friend Request'}
      </button>
    );
}

export default AcceptfriendRequest