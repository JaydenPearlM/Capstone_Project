import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import ForgotPasswordForm from "./ForgotPasswordForm";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  return (
    <div className="forgot-background">
      <header>
        <NavBar />
      </header>

      <div className="forgot-main-content">
        <div className="forgot-page">
          <h2 className="forgot-title">Forgot Password</h2>
          <ForgotPasswordForm />
          <div className="forgot-links">
            <Link to="/login" className="link">Back to Login</Link>
            <Link to="/signup" className="link">Create Account</Link>
          </div>
        </div>   
      </div>

      <footer className="footer-strip"
        style={{
          padding: "6px 0",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}>
          <Footer />
        </footer>
    </div>
  );
}
