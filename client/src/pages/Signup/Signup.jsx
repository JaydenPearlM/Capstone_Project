import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SignupForm from "./SignupForm";
import { useAuth } from "../../contexts/AuthContext";
import "./Signup.css";

export default function Signup() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (data) => {
        setLoading(true);
        setError('');

        // Remove confirmPassword before sending to backend
        const { confirmPassword, ...userData } = data;

        const result = await register(userData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="signup-background">
            <header>
                <NavBar />
            </header>
            <div className="main-content">
                <div className="signup-page">
                    <h2>Create an Account</h2>
                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    <SignupForm onSubmit={handleSignup} loading={loading} />
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
    )
}