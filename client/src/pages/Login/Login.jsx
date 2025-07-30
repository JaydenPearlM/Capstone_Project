import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import LoginForm from "./LoginForm";
import {Link} from "react-router-dom";
import "./Login.css"

export default function Login() {
    const handleLogin = (data) => {
        console.log("Login attempt with: ", data);
        // add API call or auth logic here
    };

    return (
        <div className="login-background">
            <header>
                <NavBar />
            </header>
            <div className="main-content">
                <div className="login-page">
                    <h2 className="login-title">Login</h2>
                    <LoginForm onSubmit={handleLogin} />
                    <div className="login-links">
                        <Link to="/forgot-password" className="link">Forgot password?</Link>
                        <Link to="/register" className="link">Register</Link>
                    </div>
                </div>
                <footer>
                    <Footer />
                </footer>
            </div>
        </div>
    )
}