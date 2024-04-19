import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { fetchAllRequests } from '../../Service/api';
import AcceptfriendRequest from './AcceptfriendRequest';
import { AccountContext } from '../../ContextApi/AccountProvide';
import './RequestNotification.css'

function RequestNotification() {
  const [users, setUsers] = useState([]);
  const {localAccount, account} = useContext(AccountContext)

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const requestId = localAccount?._id || account?.sub;
        const response = await fetchAllRequests(requestId);
        
        const requestData = response.requestData;

        setUsers(requestData);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  return (

    <div className="users-container">
        <h1>Users Sent You Friend Request For Chat</h1>
        <ul className="users-list">
          {users.map(user => (
            <li key={user._id} className="user-item">
              <img src={user.picture || user.profilePhoto} alt="dp-user" />
              <div className="user-details">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
              </div>
              <AcceptfriendRequest requestId={user._id || user.sub} className="accept-request-btn" />
            </li>
          ))}
        </ul>
      </div>

  );
}

export default RequestNotification