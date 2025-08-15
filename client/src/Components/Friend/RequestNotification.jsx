import React, { useContext, useState, useEffect } from 'react';
import { fetchAllRequests } from '../../Service/api';
import AcceptfriendRequest from './AcceptfriendRequest';
import { AccountContext } from '../../ContextApi/AccountProvide';

function RequestNotification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { localAccount, account } = useContext(AccountContext);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setLoading(true);
        const requestId = localAccount?._id || account?.sub;
        const response = await fetchAllRequests(requestId);
        setUsers(response.requestData || []);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [localAccount, account]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-700 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">
            Friend Requests ({users.length})
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          /* Content */
          <div className="divide-y divide-gray-700">
            {users.length > 0 ? (
              users.map(user => (
                <div key={user._id} className="p-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user.picture || user.profilePhoto} 
                        alt="Profile" 
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-600"
                      />
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate">{user.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Accept Button */}
                    <div className="flex-shrink-0">
                      <AcceptfriendRequest requestId={user._id || user.sub} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-300">No friend requests</h3>
                <p className="text-gray-500 mt-1">When you receive friend requests, they'll appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestNotification;