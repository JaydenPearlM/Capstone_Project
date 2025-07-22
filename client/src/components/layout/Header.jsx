import React from "react";
import "./Header.css"
import NavBar from "./NavBar";

export default function Header() {
    return (
        <header className="headerContainer">
            <div className="headerContent">
                <NavBar />
            </div>
        </header>
    )

}