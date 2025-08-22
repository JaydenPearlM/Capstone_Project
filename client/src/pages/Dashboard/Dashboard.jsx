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
    const [budgetData, setBudgetData] = useState({ totalSpent: 0, totalBudget: 0 });
    const [debtData, setDebtData] = useState({ totalDebt: 0 });
    const [savingsData, setSavingsData] = useState({ totalSavings: 0, goalProgress: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const budgetResponse = await authFetch(`${import.meta.env.VITE_API_URL}/budget`);
                if (!budgetResponse.ok) {
                    throw new Error("Failed to fetch budget data");
                }
                const budgetResult = await budgetResponse.json();
                setBudgetData({
                    totalSpent: budgetResult.totalSpent,
                    totalBudget: budgetResult.totalBudget,
                });

                // debt data
                try {
                    const debtResponse = await authFetch(`${import.meta.env.VITE_API_URL}/debts`);
                    if (debtResponse.ok) {
                        const debtResult = await debtResponse.json();

                        // console.log("Debt API response:", debtResult);

                        setDebtData({
                            totalDebt: debtResult.totalDebt || 0
                        });
                    }
                } catch (debtError) {
                    console.error("Error fetching debt data:", debtError);
                }

                // savings data
                try {
                    const savingsResponse = await authFetch(`${import.meta.env.VITE_API_URL}/savings`);
                    if (savingsResponse.ok) {
                        const savingsResult = await savingsResponse.json();

                        const totalSavings = savingsResult.reduce((sum, goal) => {
                            const goalTotal = goal.contributions.reduce((contribSum, contrib) => contribSum + contrib.amount, 0);
                            return sum + goalTotal;
                        }, 0);

                        const totalGoalAmount = savingsResult.reduce((sum, goal) => sum + goal.goalAmount, 0);
                        const overallProgress = totalGoalAmount > 0 ? Math.round((totalSavings / totalGoalAmount) * 100) : 0;

                        setSavingsData({
                            totalSavings,
                            goalProgress: overallProgress
                        });
                    }
                } catch (savingsError) {
                    console.error("Error fetching savings data:", savingsError);
                }

            } catch (err) {
                setError(err.message);
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading budget: {error}</p>;

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
                            <AccountsCard
                                savingsBalance={savingsData.totalSavings}
                            />
                        </div>
                    </Link>
                    <Link to="/dashboard/budgeting">
                        <div className="card">
                            <BudgetingCard />
                        </div>
                    </Link>
                    <Link to="/dashboard/debt">
                        <div className="card">
                            <DebtCard totalDebt={debtData.totalDebt} />
                        </div>
                    </Link>
                    <Link to="/dashboard/savings">
                        <div className="card">
                            <SavingsCard
                                totalSavings={savingsData.totalSavings}
                                goalProgress={savingsData.goalProgress}
                            />
                        </div>
                    </Link>
                </div>
            </div>
            <footer className="footer-strip"
                style={{
                    padding: "6px 0",
                    width: "100vw",
                    marginLeft: "calc(50% - 50vw)",
                    marginRight: "calc(50% - 50vw)"
                }}>
                <Footer />
            </footer>
        </div>
    )
}
