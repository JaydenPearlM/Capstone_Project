import React, { useState } from "react";
import "./NavBar.css";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../UI/ThemeToggle";
import CacheBudgetingLogo from "../../assets/CacheBudgetingLogo-long.png"
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const [ menuOpen, setMenuOpen ] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <div className="navBar">
      <Link to={"/"} className="logo">
        <img src={CacheBudgetingLogo}  alt="cache budgeting logo"/>
      </Link>
      <div className="menu" onClick={() => {setMenuOpen(!menuOpen);}}>
        <MenuIcon />
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
        </li>
        {user ? (
          <>
            <li>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <span style={{ color: '#333', padding: '0.5rem' }}>
                Welcome, {user.firstName}!
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/contactUs" onClick={() => setMenuOpen(false)}>
            Contact Us
          </NavLink>
        </li>
        <li className="theme-toggle-nav">
          <ThemeToggle />
        </li>
      </ul>
    </div >
  );
};

export default NavBar;
