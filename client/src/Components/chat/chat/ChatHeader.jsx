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

            <div style={{ marginLeft: '12px', fontSize: '13px', color: 'rgba(0, 0, 0, 0.6)' }}>
                  {activeUser && activeUser.find(user => {
                        if (user.sub && person.sub) {
                          return user.sub === person.sub;
                        }
                        if (user._id && person._id) {
                          return user._id === person._id;
                        }
                        return false;
                      }) ? 'Online' : 'Offline'}
          </div>
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