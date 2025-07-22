import React from "react";
import "./Home.css";
// import homepageImage from "./assets/Homepage.png";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SideBar from "../../components/layout/SideBar";

const Home = () => {
    return (
        <div className="">
            <Header />

            {/* Main Section */}
            <div className="mainContainer">
                {/* <img
                    src={homepageImage}
                    alt="Homepage Illustration"
                    className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0"
                /> */}
                <div className="">
                    <h2 className="">
                        Take Control of your Finances
                    </h2>
                    <p className="">
                        Manage Your Expenses, Track Your Savings, and Reach Your Financial Goals With Ease!
                    </p>
                    <button className="">
                        Get Started
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
