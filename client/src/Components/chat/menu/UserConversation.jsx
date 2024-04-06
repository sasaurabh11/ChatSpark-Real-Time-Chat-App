import React, { useContext } from 'react'
import './UserConversation.css'

import { AccountContext } from '../../../ContextApi/AccountProvide'

import { setConversation } from '../../../Service/api'

function UserConversation({user}) {

  const { setPerson, account } = useContext(AccountContext)

  const getUser = async () => {
    setPerson(user)
    await setConversation({senderId : account.sub, receverId : user.sub})
  }

  return (
    <div className='user-info' onClick={() => getUser()}>
        <div>
            <img src={user.picture} alt="dp-user" />
        </div>
        <div>
            <div>
                <div>{user.name}</div>
            </div>
        </div>
    </div>
  )
}

export default UserConversation