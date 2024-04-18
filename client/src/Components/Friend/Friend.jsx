import React from 'react'
import { useState } from 'react';
import SearchUsers from './SearchUsers';
import SendrequestUI from './SendrequestUI';
import './Friend.css'

function Friend() {
    const [text, setText] = useState('');

  return (
    <div className='friend-portion'>
        <SearchUsers setText={setText} />
        <SendrequestUI text={text}/>
    </div>
  )
}

export default Friend