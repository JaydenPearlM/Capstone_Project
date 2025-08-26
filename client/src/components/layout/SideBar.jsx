import React from "react";
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Home,
  AttachMoney,
  Logout,
  Dashboard,
  Savings,
  Settings,
  CreditCard,
  RealEstateAgent,
  Fullscreen,
  FullscreenExit,
  TipsAndUpdates
} from "@mui/icons-material"
import { ToggleButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <Sidebar className="SideBar" collapsed={collapsed}>
      <div className="toggle-button">
        <ToggleButton
          value="check"
          selected={collapsed}
          onChange={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed ? <Fullscreen /> : <FullscreenExit />}
        </ToggleButton>
      </div>

      <Menu className="menu">
        <MenuItem className="menu-item" icon={<Home />} href="/">
          Home
        </MenuItem>
        <MenuItem className="menu-item" icon={<Dashboard />} href="/dashboard">
          Dashboard
        </MenuItem>
        <MenuItem className="menu-item" icon={<AttachMoney />} href="/dashboard/budgeting">
          Budgeting
        </MenuItem>
        <MenuItem className="menu-item" icon={<CreditCard />} href="/dashboard/cardManagement">
          Card Management
        </MenuItem>
        <MenuItem className="menu-item" icon={<RealEstateAgent />} href="/dashboard/debt">
          Debt
        </MenuItem>
        <MenuItem className="menu-item" icon={<Savings />} href="/dashboard/savings">
          Savings
        </MenuItem>
        <MenuItem className="menu-item" icon={<TipsAndUpdates />} href="/dashboard/tutorial">
          Tutorial
        </MenuItem>
        <MenuItem className="menu-item" icon={<Settings />} href="/dashboard/settings">
          Settings
        </MenuItem>
        <MenuItem
          className="menu-item"
          icon={<Logout />}
          onClick={handleLogout}
        >
          Log out
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideBar;