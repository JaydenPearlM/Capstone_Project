import React from "react";
import "./Home.css";
// import homepageImage from "./assets/Homepage.png";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/layout/NavBar";
import homepageImage from "../../assets/Homepage_image.png"
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-background">
            <header>
                <NavBar />
            </header>

            <main className="main-section">
                <img src={homepageImage} alt="Homepage illustration" className="homePageImage" />
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
                <div className="features-section">
                    <h2 className="features-heading">What You Can Do</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Create Budgets</h3>
                            <p>Set custom budgets for your categories and track your monthly spending with ease.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Track Savings</h3>
                            <p>Set savings goals and watch your progress grow month by month.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Manage Debt</h3>
                            <p>Stay on top of your debts by logging balances and payments over time.</p>
                        </div>
                    </div>
                </div>
                <div className="about-section">
                    <h2 className="about-heading">About Us</h2>
                    <p className="about-text">
                        We are the <strong>Cache Coders</strong>, a team of college students brought together through the <strong>TechWise</strong> program, a global initiative empowering students with skills in software engineering, UX design, and problem-solving.
                    </p>
                    <p className="about-text">
                        As students ourselves, we understand the struggles of managing money during college. That’s why we created this budgeting app, a tool designed to help students like us take control of their <strong>spending</strong>, build healthy <strong>saving habits</strong>, and stay on top of <strong>debt</strong>.
                    </p>
                    <p className="about-text">
                        Our mission is simple: make personal finance easier, smarter, and more accessible — starting with the student community.
                    </p>
                </div>

            </main>
            <footer>
                <Footer />
            </footer>

        </div>
    );
};

export default Home;
