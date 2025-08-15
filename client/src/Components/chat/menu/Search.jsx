import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

function Search({ setText }) {
  return (
    <div className="px-2 py-1">
      <div className="relative flex items-center bg-gray-700 rounded-lg px-4 py-2 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500">
        <div className="text-gray-400 mr-3">
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search or start new chat"
          onChange={(e) => setText(e.target.value)}
          className="w-full text-gray-200 placeholder-gray-400"
          inputProps={{
            style: {
              border: 'none',
              outline: 'none',
              padding: '4px 0',
            },
          }}
          sx={{
            '& .MuiInputBase-input': {
              color: '#E5E7EB',
              '&::placeholder': {
                color: '#9CA3AF',
                opacity: 1,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Search;