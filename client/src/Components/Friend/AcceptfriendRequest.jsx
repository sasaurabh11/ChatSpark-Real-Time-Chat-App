import React, { useContext } from 'react'
import { useState } from 'react';
import './AcceptfriendRequest.css'

import { acceptanceforfriendShip } from '../../Service/api';
import { AccountContext } from '../../ContextApi/AccountProvide';

function AcceptfriendRequest({requestId}) {
    // const [loading, setLoading] = useState(false);

    // const {localAccount, account} = useContext(AccountContext)

    // const acceptRequest = async () => {
    //   try {
    //     setLoading(true);
        
    //     const recipientId = localAccount?._id || account?.sub;

    //     await acceptanceforfriendShip({ requestId, recipientId })

    //     alert('Friend request accepted successfully.');

    //   } catch (error) {
    //     console.error(error);
    //     alert('Error accepting friend request.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  
    // return (
    //   <button onClick={acceptRequest} disabled={loading} className="custom-button">
    //     {loading ? 'Accepting request...' : 'Accept Friend Request'}
    //   </button>
    // );

    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState('Accept Friend Request');
    const [buttonColor, setButtonColor] = useState('#007bff'); // Default button color

    const { localAccount, account } = useContext(AccountContext);

    const acceptRequest = async () => {
        try {
            setLoading(true);

            const recipientId = localAccount?._id || account?.sub;

            await acceptanceforfriendShip({ requestId, recipientId });

            setButtonText('Request Accepted');
            setButtonColor('#28a745'); // Change button color to green for success

            alert('Friend request accepted successfully.');

        } catch (error) {
            console.error(error);
            setButtonText('Error Accepting Request');
            setButtonColor('#dc3545'); // Change button color to red for error

            alert('Error accepting friend request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={acceptRequest} disabled={loading} className="custom-button" style={{ backgroundColor: buttonColor }}>
            {loading ? 'Accepting request...' : buttonText}
        </button>
    );
}

export default AcceptfriendRequest