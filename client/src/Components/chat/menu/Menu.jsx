import React, { useState } from 'react';
import Header from './Header';
import Search from './Search';
import Conversation from './Conversation';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Menu({ setShowMenu }) {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="sticky top-0 z-10 bg-gray-800">
        <Header />
      </div>

      <div className="sticky top-16 z-10 px-3 py-2 bg-gray-800 md:px-4 md:py-3">
        <Search setText={setText} />
      </div>

      <div className="flex-1 overflow-y-auto pb-2">
        <Conversation text={text} setShowMenu={setShowMenu} />
      </div>

      <div className="md:hidden absolute bottom-4 right-4">
        <IconButton
          onClick={() => setShowMenu(false)}
          aria-label="close menu"
          className="bg-gray-700 hover:bg-gray-600 text-white shadow-lg"
          sx={{
            width: 40,
            height: 40,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgb(55, 65, 81)' // gray-700
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}

export default Menu;