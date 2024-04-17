import React from 'react'
import { useState, useEffect } from 'react';
import { fetchAllRequests } from '../../Service/api';
import AcceptfriendRequest from './AcceptfriendRequest';

function RequestNotification() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        // const response = await axios.post('http://your-backend-url/getFriendRequest', { requestId: '6617a53c78608f29f61a028f' });
        const requestId = '6617a53c78608f29f61a028f';
        const response = await fetchAllRequests(requestId);
        
        const requestData = response.requestData;
        
        console.log("request Data ", requestData)

        setUsers(requestData);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            {/* Add additional user information as needed */}
            <AcceptfriendRequest requestId="6617b55746ab5aa0c5081991" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestNotification