import React, { useState } from 'react';
import Header from './Header';
import Search from './Search';
import Conversation from './Conversation';

function Menu() {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <Header />
      <div className="px-4 py-2">
        <Search setText={setText} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Conversation text={text} />
      </div>
    </div>
  );
}

export default Menu;