import React, { useContext, useEffect, useState } from "react";
import { getUser, getInfoLocalAccount, getFriendsDetails } from "../../../Service/api";
import UserConversation from "./UserConversation";

import "./Conversation.css";

import { Divider } from "@mui/material";

import { AccountContext } from "../../../ContextApi/AccountProvide";

function Conversation({ text }) {
    // const [users, setUser] = useState([]);
    // const [localUsers, setLocalUsers] = useState([]);

    const [friends, setFriends] = useState([])

    const { account, socket, setActiveUser, localAccount } = useContext(AccountContext);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let resopnse = await getUser();
    //         let filterData = resopnse.filter((user) =>
    //             user.name.toLowerCase().includes(text.toLowerCase())
    //         );
    //         setUser(filterData);
    //     };
    //     fetchData();
    // }, [text]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let response = await getInfoLocalAccount();
    //         let filterData = response.filter((user) =>
    //             user.name.toLowerCase().includes(text.toLowerCase())
    //         );
    //         setLocalUsers(filterData);
    //     };
    //     fetchData();
    // }, [text]); 

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

            setFriends(filterData)
        }

        fetchData();
    }, [text])

    useEffect(() => {
        const accountTosendSocket = account || localAccount

        socket.current.emit("addUsers", accountTosendSocket);
        socket.current.on("getUsers", (users) => {
            setActiveUser(users);
        });
    }, [account]);

    return (
        <div className="AllUsers">

                {friends.length > 0 && localAccount && (
                    <>
                        {friends.map((friendship) => {
                            return friendship.users.map((user) => {
                                if (user && user._id) {
                                    if (user._id !== localAccount._id) {
                                        return (
                                            <React.Fragment key={user._id}>
                                                <UserConversation user={user} />
                                                <Divider />
                                            </React.Fragment>
                                        );
                                    } else {
                                        return null; 
                                    }
                                } else {
                                    return null;
                                }
                            });
                        })}
                    </>
                )}
            {friends.length === 0 && <p className="para">No users found. Add friends to start chat!</p>}
        </div>
    );
}

export default Conversation;
