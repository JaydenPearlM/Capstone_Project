import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SideBar from "../../components/layout/SideBar";
import AccountsCard from "../../components/UI/AccountsCard";
import BudgetingCard from "../../components/UI/BudgetingCard";
import DebtCard from "../../components/UI/DebtCard";
import SavingsCard from "../../components/UI/SavingsCard";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [budgetData, setBudgetData] = useState({ totalSpent: 0, totalBudget: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/budget`);
        if (!response.ok) throw new Error("Failed to fetch budget data");
        const data = await response.json();
        setBudgetData({ totalSpent: data.totalSpent, totalBudget: data.totalBudget });
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

  return (
    <div>
      <header><NavBar /></header>
      <div className="dashboard-container">
        <SideBar />
        <div className="content">
          {/* Keep this path in sync with your router */}
          <Link to="/dashboard/CardManagement">
            <div className="card">
              <AccountsCard />
            </div>
          </Link>

          <Link to="/dashboard/budgeting">
            <div className="card">
              <BudgetingCard totalSpent={budgetData.totalSpent} totalBudget={budgetData.totalBudget} />
            </div>
          </Link>

          <Link to="/dashboard/debt">
            <div className="card"><DebtCard /></div>
          </Link>

          <Link to="/dashboard/savings">
            <div className="card"><SavingsCard /></div>
          </Link>
        </div>
      </div>
      <footer><Footer /></footer>
    </div>
  );
}
