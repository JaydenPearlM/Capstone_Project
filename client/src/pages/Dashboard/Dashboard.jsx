import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SideBar from "../../components/layout/SideBar";
import AccountsCard from "../../components/UI/AccountsCard";
import BudgetingCard from "../../components/UI/BudgetingCard";
import DebtCard from "../../components/UI/DebtCard";
import SavingsCard from "../../components/UI/SavingsCard";
import { useAuth } from "../../contexts/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
    const { authFetch } = useAuth();
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error loading data: {error}</p>;

    return (
        <div>
            <header>
                <NavBar />
            </header>
            <div className="dashboard-container">
                <SideBar />
                <div className="content">
                    <Link to="/dashboard/cardManagement">
                        <div className="card">
                            <AccountsCard />
                        </div>
                    </Link>
                    <Link to="/dashboard/budgeting">
                        <div className="card">
                            <BudgetingCard/>
                        </div>
                    </Link>
                    <Link to="/dashboard/debt">
                        <div className="card">
                            <DebtCard />
                        </div>
                    </Link>
                    <Link to="/dashboard/savings">
                        <div className="card">
                            <SavingsCard />
                        </div>
                    </Link>
                </div>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
