import { useEffect, useState } from "react";
import "./BudgetSummary.css";

const BudgetSummary = ({categories, transactions}) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/budget`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch budget summary:", err);
      }
    };
    if (categories.length && transactions.length) {
      fetchSummary();
    }
  }, [categories, transactions]);

  if (!summary) return <p>Loading budget summary...</p>;

  return (
    <div className="budgeting-section">
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
