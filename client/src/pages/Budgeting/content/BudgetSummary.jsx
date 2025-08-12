import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./BudgetSummary.css";
import { useAuth } from "../../../contexts/AuthContext";

const BudgetSummary = ({ categories, transactions }) => {
  const { authFetch } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/budget`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch budget summary:", err);
      }
    };
    if (categories.length) {
      fetchSummary();
    }
  }, [categories, transactions, authFetch]);

  const getCategorySpending = (categoryId) =>
    transactions
      .filter(
        (tx) =>
          tx.categoryId &&
          (tx.categoryId._id?.toString?.() || tx.categoryId.toString()) ===
            categoryId.toString()
      )
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalBudget = categories.reduce(
    (sum, cat) => sum + Number(cat.budget),
    0
  );
  const totalSpent = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );
  const remaining = Math.max(totalBudget - totalSpent, 0);

  const pastelColors = [
    "#A8DADC", "#FFDDD2", "#FFD6E0", "#E0BBE4", "#B5EAD7",
    "#C7CEEA", "#FCD5CE", "#D8E2DC", "#E2F0CB", "#B5D2CB",
  ];

  const pieData = {
    labels: [...categories.map((cat) => cat.name), "Remaining Budget"],
    datasets: [
      {
        data: [
          ...categories.map((cat) => getCategorySpending(cat._id)),
          remaining,
        ],
        backgroundColor: [
          ...categories.map((_, idx) => pastelColors[idx % pastelColors.length]),
          "#D3D3D3",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  if (!summary) return <p>Loading budget summary...</p>;

  return (
    <div className="budgeting-section">
      <div className="pieChart">
        <Pie data={pieData} />
      </div>

      <div className="total-budget-summary">
        <p><strong>Total Budget:</strong> ${summary.totalBudget.toFixed(2)}</p>
        <p><strong>Total Spent:</strong> ${summary.totalSpent.toFixed(2)}</p>
        <p><strong>Remaining:</strong> ${summary.remaining.toFixed(2)}</p>
      </div>

      <div className="budget-header budget-row" id="budget-header">
        <div className="category-name">Category</div>
        <div className="category-budget">Budget</div>
        <div className="category-spent">Spent</div>
        <div className="category-remaining">Remaining</div>
      </div>

      <ul className="category-list">
        {summary.categorySummaries.map((cat) => {
          const remaining = cat.budget - cat.spent;
          return (
            <div
              key={cat._id}
              className={`budget-item ${remaining < 0 ? "over-budget" : ""}`}
            >
              <div className="budget-row">
                <div className="category-name">{cat.name}</div>
                <div className="category-budget">${Number(cat.budget).toFixed(2)}</div>
                <div className="category-spent">${cat.spent.toFixed(2)}</div>
                <div className="category-remaining">${remaining.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default BudgetSummary;
