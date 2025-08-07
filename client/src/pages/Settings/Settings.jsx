import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import ChangePasswordForm from "./ChangePasswordForm";
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
                    <ChangePasswordForm />
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}