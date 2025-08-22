import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import ChangePasswordForm from "./ChangePasswordForm";
import UserProfile from "../../components/UserProfile";
import "./Settings.css";

export default function Settings() {
    return (
        <div className="settings-page">
            <header>
                <NavBar />
            </header>

            <div className="settings-main">
                <SideBar />
                <div className="settings-content">
                    <h1>Settings</h1>
                    <UserProfile />
                    <br />
                    <ChangePasswordForm />
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