import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footerContainer">
            <div className="footerContent">
                © 2025 Cache Coders &nbsp; | &nbsp;
                <a href="#" className="underline">Terms</a> &nbsp; | &nbsp;
                <a href="#" className="underline">Privacy</a>
            </div>
        </footer>
    )
}

export default Footer;