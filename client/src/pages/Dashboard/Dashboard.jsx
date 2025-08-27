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
    const [accountBalance, setAccountBalance] = useState(0);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                // Budget
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

                        setSavingsData({
                            totalSavings: savingsResult.totalSavings || 0,
                            goalProgress: savingsResult.goalProgress || 0
                        });
                    }
                } catch (savingsError) {
                    console.error("Error fetching savings data:", savingsError);
                    setSavingsData({totalSavings: 0, goalProgress: 0});
                }

                //Accounts
                try {
                    const cardsResponse = await authFetch(`${import.meta.env.VITE_API_URL}/cards`);
                    if (cardsResponse.ok) {
                        const cardsResult = await cardsResponse.json();
                        const debitTotal = (Array.isArray(cardsResult) ? cardsResult : [])
                            .filter(card => card.type === 'debit')
                            .reduce((sum, card) => sum + card.balance, 0);
                        setAccountBalance(debitTotal);
                    }
                } catch (cardsError) {
                    console.error("Error fetching cards data:", cardsError);
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
                                accountBalance={accountBalance}
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
