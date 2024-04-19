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
    <div className="Allfriends">

            {users.length > 0 && account && (
                <>
                    {users.map(
                        (user) =>
                            user &&
                            account &&
                            user.sub !== account.sub && (
                                <div key={user.sub}>
                                    <AllUsers user={user} />
                                    <Divider sx={{ width: '300px' }} />
                                </div>
                            )
                    )}
                    {localUsers.map(
                        (user) =>
                            user && (
                                <div key={user._id}>
                                    <AllUsers user={user} />
                                    <Divider sx={{ width: '300px'}} />
                                </div>
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
                                <div key={user._id}>
                                    <AllUsers user={user} />
                                    <Divider sx={{ width: '300px'}} />
                                </div>
                            )
                    )}

                    {users.map(
                        (user) =>
                            user &&
                            (
                                <div key={user.sub}>
                                    <AllUsers user={user} />
                                    <Divider sx={{ width: '300px'}} />
                                </div>
                            )
                    )}
                </>
            )}
            {users.length === 0 && localUsers.length === 0 && <p>No users found</p>}
        </div>
  )
}

SendrequestUI.defaultProps = {
  text: ''
};

export default SendrequestUI