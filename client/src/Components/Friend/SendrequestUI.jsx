import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { getUser, getInfoLocalAccount } from '../../Service/api';
import AllUsers from './AllUsers';
import { AccountContext } from '../../ContextApi/AccountProvide';
import { Divider } from "@mui/material";

function SendrequestUI({text}) {
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
                                    <AllUsers user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                    {localUsers.map(
                        (user) =>
                            user && (
                                <React.Fragment key={user._id}>
                                    <AllUsers user={user} />
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
                                    <AllUsers user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}

                    {users.map(
                        (user) =>
                            user &&
                            (
                                <React.Fragment key={user.sub}>
                                    <AllUsers user={user} />
                                    <Divider />
                                </React.Fragment>
                            )
                    )}
                </>
            )}
            {users.length === 0 && localUsers.length === 0 && <p>No users found</p>}
        </div>
  )
}

SendrequestUI.defaultProps = {
  text: '' // Default value is an empty string
};

export default SendrequestUI