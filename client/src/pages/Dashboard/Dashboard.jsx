import React from "react";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SideBar from "../../components/layout/SideBar";
import AccountsCard from "../../components/UI/AccountsCard";
import BudgetingCard from "../../components/UI/BudgetingCard";
import DebtCard from "../../components/UI/DebtCard";
import SavingsCard from "../../components/UI/SavingsCard";
import "./Dashboard.css";
<<<<<<< HEAD
import {Link} from "react-router-dom";

export default function Dashboard() {
=======
import { Link } from "react-router-dom";
import { useState, useEffect} from "react";

export default function Dashboard() {
    const [budgetData, setBudgetData] = useState({ totalSpent: 0, totalBudget: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBudgetData() {
            try {
                const response = await fetch("/api/budget"); // Your real API endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch budget data");
                }
                const data = await response.json();
                setBudgetData({
                    totalSpent: data.totalSpent,
                    totalBudget: data.totalBudget,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchBudgetData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading budget: {error}</p>;

>>>>>>> main
    return (
        <div>
            <header>
                <NavBar />
            </header>
            <div className="dashboard-container">
                <SideBar />
                <div className="content">
<<<<<<< HEAD
                    <Link to="/cardManagement">
=======
                    <Link to="/dashboard/cardManagement">
>>>>>>> main
                        <div className="card">
                            <AccountsCard />
                        </div>
                    </Link>
<<<<<<< HEAD
                    <Link to="/budgeting">
                        <div className="card">
                            <BudgetingCard />
                        </div>
                    </Link>
                    <Link to="/debt">
=======
                    <Link to="/dashboard/budgeting">
                        <div className="card">
                            <BudgetingCard
                                totalSpent={budgetData.totalSpent}
                                totalBudget={budgetData.totalBudget}
                            />
                        </div>
                    </Link>
                    <Link to="/dashboard/debt">
>>>>>>> main
                        <div className="card">
                            <DebtCard />
                        </div>
                    </Link>
<<<<<<< HEAD
                    <Link to="/savings">
=======
                    <Link to="/dashboard/savings">
>>>>>>> main
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

    )
}