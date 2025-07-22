import React from "react";
import "./NavBar.css";
import { Link, NavLink } from 'react-router-dom';
import CacheBudgetingLogo from "../../assets/CacheBudgetingLogo-long.png";

const NavBar = () => {
  //user
  //logout

  return (
    <div className="navbar-container container">
      <div>
        <Link to={"/"}>
          <img className="logo" src={CacheBudgetingLogo}/>
        </Link>
      </div>
      <nav className="top-nav">
        <ul className="nav-items">
          <li>
            <NavLink className={({isActive}) =>
              isActive ? "nav-link active" : "nav-link"} 
              to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) =>
              isActive ? "nav-link active" :"nav-link"}
              to="/dashboard">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) =>
             isActive ? "nav-link active" : "nav-link"}
             to="/login">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) =>
             isActive ? "nav-link active" : "nav-link"}
             to="/signup">
              Sign Up
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
