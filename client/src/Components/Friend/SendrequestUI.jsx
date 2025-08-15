import React, { useState, useEffect, useContext } from 'react';
import { getUser, getInfoLocalAccount } from '../../Service/api';
import AllUsers from './AllUsers';
import { AccountContext } from '../../ContextApi/AccountProvide';

function SendrequestUI({ text }) {
    const [users, setUser] = useState([]);
    const [localUsers, setLocalUsers] = useState([]);
    const { account, localAccount } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUser();
            const filteredData = response.filter(user => 
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setUser(filteredData);
        };
        fetchData();
    }, [text]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getInfoLocalAccount();
            const filteredData = response.filter(user =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setLocalUsers(filteredData);
        };
        fetchData();
    }, [text]);

    const filteredUsers = [...users, ...localUsers].filter(user => {
        if (account) return user.sub !== account.sub;
        if (localAccount) return user._id !== localAccount._id;
        return true;
    });

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map(user => (
                        <div 
                            key={user.sub || user._id} 
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <AllUsers user={user} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-lg">No users found</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                </div>
            )}
        </div>
    );
}

export default SendrequestUI;