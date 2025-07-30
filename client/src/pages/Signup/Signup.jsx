import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SignupForm from "./SignupForm";
import "./Signup.css";

export default function Signup() {
    const handleSignup = (data) => {
        console.log("Signup data:", data);
        // TODO: send to backend API or further processing
    };

    return (
        <div className="signup-background">
            <header>
                <NavBar />
            </header>
            <div className="main-content">
                <div className="signup-page">
                    <h2>Create an Account</h2>
                    <SignupForm onSubmit={handleSignup} />
                </div>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}