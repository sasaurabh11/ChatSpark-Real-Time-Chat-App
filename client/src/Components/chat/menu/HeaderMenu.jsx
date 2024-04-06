import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import "./HeaderMenu.css";

function HeaderMenu({setdrawer}) {

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false)
  }
  
  const handleClick = (e) => {
    setOpen(e.currentTarget)
  }

  return (
    <div>
      <MoreVertIcon className="moverticon" onClick={handleClick}/>
      <Menu
          anchorEl={open}
          keepMounted
          open={open}
          onClose={handleClose}
          // getContentAnchorE1={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}

          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
      >
          <MenuItem onClick={() => { handleClose(); setdrawer(true); }}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default HeaderMenu;
