import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";

export default function Goals(){
    return(
        <div>
            <header>
                <NavBar />
            </header>
            
            <div>
                <SideBar />
                <p>
                    Goals page
                </p>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}