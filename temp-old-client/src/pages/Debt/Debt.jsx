import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";

export default function Debt(){
    return(
        <div>
            <header>
                <NavBar />
            </header>
            
            <div>
                <SideBar />
                <p>debt pages</p>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}