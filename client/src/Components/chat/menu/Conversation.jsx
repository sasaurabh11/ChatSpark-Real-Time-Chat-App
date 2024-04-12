import React, { useContext, useEffect, useState } from "react";
import { getUser, getInfoLocalAccount } from "../../../Service/api";
import UserConversation from "./UserConversation";

import "./Conversation.css";

import { Divider } from "@mui/material";

import { AccountContext } from "../../../ContextApi/AccountProvide";

function Conversation({ text }) {
    const [users, setUser] = useState([]);
    const [localUsers, setLocalUsers] = useState([]);

    const { account, socket, setActiveUser, localAccount } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            let resopnse = await getUser();
            let filterData = resopnse.filter((user) =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setUser(filterData);
        };
        fetchData();
    }, [text]);

    useEffect(() => {
        const fetchData = async () => {
            let response = await getInfoLocalAccount();
            let filterData = response.filter((user) =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setLocalUsers(filterData);
        };
        fetchData();
    }, [text]); 

    useEffect(() => {
        const accountTosendSocket = account || localAccount

        socket.current.emit("addUsers", accountTosendSocket);
        socket.current.on("getUsers", (users) => {
            // console.log("users", users)
            setActiveUser(users);
        });
    }, [account]);

    return (
        <div className="AllUsers">

            {users.length > 0 && account && (
                <>
                    {users.map(
                        (user) =>
                            user &&
                            account &&
                            user.sub !== account.sub && (
                                <React.Fragment key={user.sub}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                    {localUsers.map(
                        (user) =>
                            user && (
                                <React.Fragment key={user._id}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                </>
            )} 

            {localUsers.length > 0 && localAccount &&(
                <>
                    {localUsers.map(
                        (user) =>
                            user &&
                            localAccount &&
                            user._id !== localAccount._id && (
                                <React.Fragment key={user._id}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}

                    {users.map(
                        (user) =>
                            user &&
                            (
                                <React.Fragment key={user.sub}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                </>
            )}

            {/* {users.length > 0 && (
                <>
                    {users.map(
                        (user) =>
                            user &&
                            account &&
                            user.sub !== account.sub && (
                                <React.Fragment key={user.sub}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                </>
            )}

            {localUsers.length > 0 && (
                <>
                    {localUsers.map(
                        (user) =>
                            user &&
                            localAccount &&
                            user._id !== localAccount._id && (
                                <React.Fragment key={user._id}>
                                    <UserConversation user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                </>
            )} */}
            {users.length === 0 && localUsers.length === 0 && <p>No users found</p>}
        </div>
    );
}

export default Conversation;
