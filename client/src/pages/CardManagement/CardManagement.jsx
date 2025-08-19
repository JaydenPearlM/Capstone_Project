import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import "./CardManagement.css";

export default function CardManagement(){
    return(
         <div className="card-management-page">
            <header>
                <NavBar />
            </header>

            <div className="card-management-content">
                <SideBar />
                <div className="coming-soon-section">
                    <h1>Coming Soon...</h1>
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}