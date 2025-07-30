import React, { useState } from "react";
import "./NavBar.css";
import { Link, NavLink } from 'react-router-dom';
import CacheBudgetingLogo from "../../assets/CacheBudgetingLogo-long.png"
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const [ menuOpen, setMenuOpen ] = useState(false);
  //user
  //logout

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
          <NavLink to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    </div >
  );
};

export default NavBar;
