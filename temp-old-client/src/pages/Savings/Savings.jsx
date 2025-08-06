import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";

export default function Savings(){
    return(
        <div>
            <header>
                <NavBar />
            </header>
            
            <div>
                <SideBar />
                <p>savings page</p>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}