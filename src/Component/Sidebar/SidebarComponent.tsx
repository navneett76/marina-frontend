import "./SidebarComponent.css";
// import LoginAPI from "../ContextAPI/ContextAPI";
import React, { useEffect, useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { usePorts } from "../../contexts/PortContext";
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

// import  from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DescriptionIcon from '@mui/icons-material/Description';


const SidebarContainer = styled.div`
    width: 100%;
    margin-bottom: auto;
    font-size: 16px;
    color: #02158b;
`;

const SidebarLink = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 10px;
    color: #02158b;
    text-decoration: none;
    margin-bottom: 10px;

    &:hover {
        background-color: rgb(255 255 255);
    }
    &.active {
        background-color: rgb(255 255 255);
    }
`;

const SidebarComponent = () => {
    // const { user, logout } = useAuth();
    // const { ports, selectedPort, setSelectedPort } = usePorts();

    return (
        <>
            <aside className="sidebar">
                <SidebarContainer>
                    <SidebarLink to="/contracts"><DescriptionIcon /> &nbsp; Contracts</SidebarLink>
                    <SidebarLink to="/customers"><GroupAddIcon /> &nbsp; Customer</SidebarLink>
                    {/* <SidebarLink to="/report"><i className="fa-regular fa-user"></i> &nbsp; Reports</SidebarLink> */}
                </SidebarContainer>
                {/* <div className="nav-links">
                    <a href="#" className="active"><i className="fas fa-home"></i> Dashboard</a>
                    <a href="#"><i className="fas fa-users"></i> Customer</a>
                    <a href="#"><i className="fa-regular fa-user"></i> Reports</a>
                </div> */}
            </aside>
        </>
    )
}

export default SidebarComponent;