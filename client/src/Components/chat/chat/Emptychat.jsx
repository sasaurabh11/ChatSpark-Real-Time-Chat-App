import React from 'react'
import './Emptychat.css'
import { NavLink } from 'react-router-dom';

function Emptychat() {
  return (
    <div className='empty-chat-all'>
      <h1>Welcome to ChatSpark</h1>
      <p>Looks like there are no messages here yet. Start chatting with your friends!</p>
      <NavLink
        to='/add-friends'
      >

      <button className='cta-button'>Start Chatting</button>
      </NavLink>
    </div>
  );
}

export default Emptychat