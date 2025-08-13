import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import LoginForm from "./LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css"

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setLoading(true);
        setError('');
        
        const result = await login(data.email, data.password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="login-background">
            <header>
                <NavBar />
            </header>
            <div className="main-content">
                <div className="login-page">
                    <h2 className="login-title">Login</h2>
                    {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                    <LoginForm onSubmit={handleLogin} loading={loading} />
                    <div className="login-links">
                        <Link to="/forgot-password" className="link">Forgot password?</Link>
                        <Link to="/signup" className="link">Create Account</Link>
                    </div>
                </div>
                
            </div>

            <footer>
                    <Footer />
                </footer>
        </div>
    )
}