import React, { useContext, useEffect, useState } from "react";
import { getFriendsDetails } from "../../../Service/api";
import UserConversation from "./UserConversation";
import { Divider } from "@mui/material";
import { AccountContext } from "../../../ContextApi/AccountProvide";

function Conversation({ text, setShowMenu }) {
    const [friends, setFriends] = useState([]);
    const { selectedLang, setSelectedLang } = useContext(AccountContext);
    const { account, socket, setActiveUser, localAccount } = useContext(AccountContext);

    useEffect(() => {
        if (!selectedLang) return;
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
    }, [text, selectedLang]);

    useEffect(() => {
        if (!selectedLang) return;
        const accountTosendSocket = account || localAccount;

        socket.current.emit("addUsers", {
            ...accountTosendSocket,
            preferredLang: selectedLang
        });

        socket.current.on("getUsers", (users) => {
            setActiveUser(users);
        });
    }, [account, selectedLang]);

    if (!selectedLang) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                <div className="relative z-10 bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h2 className="text-lg md:text-xl mb-4 text-white text-center">Select Your Language</h2>
                    <select
                        className="p-2 bg-gray-700 rounded w-full text-white mb-4 text-sm md:text-base"
                        onChange={(e) => {
                            setSelectedLang(e.target.value);
                            localStorage.setItem("preferredLang", e.target.value);
                        }}
                    >
                        <option value="">-- Choose Language --</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                    </select>
                    <p className="text-gray-400 text-xs md:text-sm text-center">
                        Select your preferred language to continue
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            {friends.length > 0 && localAccount ? (
                friends.map((friendship) => {
                    return friendship.users.map((user) => {
                        if (user && user._id && user._id !== localAccount._id) {
                            return (
                                <React.Fragment key={user._id}>
                                    <div
                                        onClick={() => {
                                            if (window.innerWidth < 768) setShowMenu(false);
                                        }}
                                        className="hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <UserConversation user={user} />
                                    </div>
                                    <Divider className="bg-gray-700" />
                                </React.Fragment>
                            );
                        }
                        return null;
                    });
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-4">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 md:h-16 md:w-16 mb-3 md:mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-base md:text-lg text-center">No conversations found</p>
                    <p className="text-xs md:text-sm mt-1 md:mt-2 text-center">Add friends to start chatting!</p>
                </div>
            )}
        </div>
    );
}

export default Conversation;