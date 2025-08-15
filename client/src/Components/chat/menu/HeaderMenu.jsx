import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext } from "react";
import { AccountContext } from "../../../ContextApi/AccountProvide";

function HeaderMenu({ setdrawer }) {
  const { logout } = useContext(AccountContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors focus:outline-none"
      >
        <MoreVertIcon className="text-gray-300 hover:text-indigo-400" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            backgroundColor: "#1F2937",
            color: "#F3F4F6",
            marginTop: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            minWidth: "180px",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setdrawer(true);
          }}
          className="hover:bg-gray-700"
        >
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:bg-gray-700">
          My Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            logout(); 
            window.location.href = "/"; 
          }}
          className="text-red-400 hover:bg-gray-700"
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default HeaderMenu;
