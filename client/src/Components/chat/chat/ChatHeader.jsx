import React, { useContext } from 'react'
import { AccountContext } from '../../../ContextApi/AccountProvide'
import { MoreVert, Search } from '@mui/icons-material'

import './ChatHeader.css'

function ChatHeader({person}) {

  const { account, activeUser } = useContext(AccountContext)

  const personPhoto = person?.picture || person?.profilePhoto

  return (
    <div className='Header'>
        <img src={personPhoto} alt="dp" />
        <div> 
            <div style={{marginLeft:'12px'}}>{person.name}</div>
            {/* <div style={{marginLeft:'12px', fontSize: '12px', color:'rgba(0, 0, 0, 0.6'}}> {activeUser?.find(user => console.log(user) ((user.sub === person.sub) || (user._id === person._id))) ? 'Online' : 'Offline'} </div> */}

            <div style={{ marginLeft: '12px', fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
            {/* console.log("user in header", user); console.log("person in header", person); */}
              {activeUser?.find(user => { return ((user.sub === person.sub) || (user._id === person._id)); }) ? 'Online' : 'Offline'}
          </div>

            {/* her I have to check */}
        </div>
        <div className='icons'>
            <Search/>
            <MoreVert/>
        </div>
        {/* <div>ChatHeader</div> */}
    </div>
  )
}

export default ChatHeader