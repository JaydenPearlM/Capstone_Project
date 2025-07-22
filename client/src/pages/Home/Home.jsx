import React from "react";
import "./Home.css";
// import homepageImage from "./assets/Homepage.png";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/layout/NavBar";
import homepageImage from "../../assets/Homepage_image.png"
import {Link} from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <header>
                <NavBar />
            </header>
            

            <main className="main-section">
                <img src={homepageImage} alt="Homepage illustration" className="homePageImage"/>
                <div className="main-text">
                    <h2 className="main-heading">
                        Take Control of your Finances
                    </h2>
                    <p className="main-subtext">
                        Manage your expenses, track your savings, and reach your financial goals with ease!
                    </p>
                    <Link to="/signup">
                        <button className="getStartedBtn">Get Started</button>
                    </Link>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
            
        </div>
    );
};

export default Home;
