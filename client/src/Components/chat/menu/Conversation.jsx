import React, { useContext, useEffect, useState } from "react";
import { getFriendsDetails } from "../../../Service/api";
import UserConversation from "./UserConversation";
import { Divider } from "@mui/material";
import { AccountContext } from "../../../ContextApi/AccountProvide";

function Conversation({ text }) {
    const [friends, setFriends] = useState([]);
    const { account, socket, setActiveUser, localAccount } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            const requestId = account?.sub || localAccount?._id;
            const response = await getFriendsDetails(requestId);

            let filterData = response.map(friendship => {
                const filteredUsers = friendship.users.filter(user => 
                    user.name.toLowerCase().includes(text.toLowerCase())
                );
                return { ...friendship, users: filteredUsers };
            });

            setFriends(filterData);
        };

        fetchData();
    }, [text]);

    useEffect(() => {
        const accountTosendSocket = account || localAccount;
        socket.current.emit("addUsers", accountTosendSocket);
        socket.current.on("getUsers", (users) => {
            setActiveUser(users);
        });
    }, [account]);

    return (
        <div className="overflow-y-auto h-full">
            {friends.length > 0 && localAccount ? (
                friends.map((friendship) => {
                    return friendship.users.map((user) => {
                        if (user && user._id && user._id !== localAccount._id) {
                            return (
                                <React.Fragment key={user._id}>
                                    <UserConversation user={user} />
                                    <Divider className="bg-gray-700" />
                                </React.Fragment>
                            );
                        }
                        return null;
                    });
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg">No conversations found</p>
                    <p className="text-sm mt-2">Add friends to start chatting!</p>
                </div>
            )}
        </div>
    );
}

export default Conversation;