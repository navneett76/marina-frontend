import "./HeaderComponent.css";
// import LoginAPI from "../ContextAPI/ContextAPI";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePorts } from "../../contexts/PortContext";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LazyLoadImage from "../Common/LazyLoad/LazyLoadImage";


const HeaderComponent = () => {
    const { user, logout } = useAuth();
    const { ports, selectedPort, setSelectedPort } = usePorts();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleLogout = () => {
        // Clear user authentication data here
        // localStorage.removeItem('token');
        // history.push('/login');
        logout();
        handleClose();
      };
    
      const handleProfile = () => {
        // history.push('/profile');
        handleClose();
      };

    const handlePortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPortId = parseInt(event.target.value, 10);
        // Update selected port logic if needed
        setSelectedPort(selectedPortId);
        localStorage.setItem("selectedport", ''+selectedPortId)
    };

    useEffect(() => {
        // Assume the first port is the default selected port if none is selected
        if (ports.length > 0 && selectedPort === null) {
            setSelectedPort(ports[0].id);
        }
    }, [ports, selectedPort, setSelectedPort]);


    return (
        <>
            <header className='header-section'>
                <div className="logo__container"><LazyLoadImage src='../../../logo.png' alt="imagelogo" className='logo-img' /></div>

                {/* <div className="header-user-section">
                    <div className="username-section">
                        <span><i className="fa-regular fa-user"></i> {user?.username}</span>
                        <select className="port-list" value={selectedPort ?? undefined} onChange={handlePortChange}>
                            {ports.map(port => (
                                <option key={port.id} value={port.id}  >
                                    {port.portName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="logoutlink" onClick={logout}>Logout</div>
                </div> */}
                <div className="header-user-section">
                    <div className="username-section">
                        <span><i className="fa-regular fa-user"></i> <b>Welcome {(user)? user.username: ''}</b></span>
                        <select className="port-list" value={selectedPort ? selectedPort: undefined} onChange={handlePortChange}>
                            {ports.map(port => (
                                <option className="option_val" key={port.id} value={port.id}  >
                                    {port.portName}
                                </option>
                            ))}
                        </select>
                    </div>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle sx={{ fontSize: 50 }}/>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={open}
            onClose={handleClose}
            
          >
            
            <MenuItem onClick={handleLogout}
            sx={{
                color: 'blue', // Set the text color
                fontSize: '20px', // Set the font size
                margin: '10px 0'
              }}>Logout</MenuItem>
          </Menu>
        </div>
            </header>
        </>
    )
}

export default HeaderComponent;