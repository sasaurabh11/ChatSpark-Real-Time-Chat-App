import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

function SearchUsers({setText}) {
  return (
    <div className='search-portion'>
        <div className='wrapper'>

            <div className='Icon'>
                <SearchIcon/>
            </div>

            <InputBase className='InputField'
              placeholder='Search or Start new chat'
              onChange={(e) => setText(e.target.value)} 
              inputProps={{ style: { border: 'none' } }}
            />
        </div>
    </div>
  )
}

export default SearchUsers