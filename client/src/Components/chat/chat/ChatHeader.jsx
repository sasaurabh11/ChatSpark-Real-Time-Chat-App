import React, { useContext } from 'react'
import { AccountContext } from '../../../ContextApi/AccountProvide'
import { MoreVert, Search } from '@mui/icons-material'

import './ChatHeader.css'

function ChatHeader({person}) {

    const { account } = useContext(AccountContext)
  return (
    <div className='Header'>
        <img src={person.picture} alt="dp" />
        <div>
            <div style={{marginLeft:'12px'}}>{person.name}</div>
            <div style={{marginLeft:'12px', fontSize: '12px', color:'rgba(0, 0, 0, 0.6'}}>Online Status</div>
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