import React, { useState } from 'react'
import Header from './Header'
import Search from './Search';
import './Menu.css'
import Conversation from './Conversation';

function Menu() {
  const [text, setText] = useState('');

  return (
    <> 
        <Header/> 
        <Search setText = {setText} />
        <Conversation text = {text} />
    </>
  )
}

export default Menu