import { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import "./BudgetSummary.css";

const BudgetSummary = ({ categories, transactions, view, dateRange }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const adjustBudgetForView = (category) => {
    const { budget, budgetPeriod = "monthly" } = category;
    if (budgetPeriod === "monthly") return budget;
    if (budgetPeriod === "biweekly") {
      if (view === "monthly") return budget * 2;
      if (view === "biweekly") return budget;
      if (view === "weekly") return budget / 2;
    }
    if (budgetPeriod === "weekly") {
      if (view === "monthly") return budget * 4;
      if (view === "biweekly") return budget * 2;
      if (view === "weekly") return budget;
    }
    return budget;
  };

  const getCategorySpending = (category) =>
    transactions
      .filter((tx) => {
        const catId = tx.categoryId?._id?.toString() || tx.categoryId?.toString();
        return catId === category._id.toString();
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const adjustedCategories = useMemo(() => {
    return categories.map((cat) => {
      const adjustedBudget = adjustBudgetForView(cat);
      const spent = getCategorySpending(cat);
      const remaining = adjustedBudget - spent;
      return {
        ...cat,
        adjustedBudget,
        spent,
        remaining,
      };
    });
  }, [categories, transactions, view]);

  const totalBudget = adjustedCategories.reduce((sum, c) => sum + c.adjustedBudget, 0);
  const totalSpent = adjustedCategories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = Math.max(totalBudget - totalSpent, 0);

  const pastelColors = [
    "#A8DADC","#FFDDD2","#FFD6E0","#E0BBE4","#B5EAD7","#C7CEEA",
    "#FCD5CE","#D8E2DC","#E2F0CB","#B5D2CB","#F9E2AE","#C1DAD6",
    "#F7CAC9","#D0CFEA","#FFE1E8","#E8F1F2","#FBE7C6","#BFD8B8",
    "#F6D6AD","#D7BCE8"
  ];

  const pieData = {
    labels: [...adjustedCategories.map((cat) => cat.name), "Remaining Budget"],
    datasets: [
      {
        data: [...adjustedCategories.map((cat) => cat.spent), remaining],
        backgroundColor: [
          ...adjustedCategories.map((_, idx) => pastelColors[idx % pastelColors.length]),
          "#D3D3D3",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const formatDisplayDate = (date) => {
    if (!(date instanceof Date)) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  if (!categories.length) return <p>Loading budget summary...</p>;

  // Limit categories to first 3 if showAllCategories is false
  const categoriesToDisplay = showAllCategories ? adjustedCategories : adjustedCategories.slice(0, 3);

  return (
    <div className="budgeting-section">
      {dateRange && (
        <p className="current-period">
          Current Period: {formatDisplayDate(dateRange.start)} - {formatDisplayDate(dateRange.end)}
        </p>
      )}

      <div className="pieChart">
        <Pie data={pieData} />
      </div>

      <div className="total-budget-summary">
        <p><strong>Total Budget:</strong> ${totalBudget.toFixed(2)}</p>
        <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
        <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>
      </div>

      <div className="budget-header budget-row" id="budget-header">
        <div className="category-name">Category</div>
        <div className="category-budget">Budget</div>
        <div className="category-spent">Spent</div>
        <div className="category-remaining">Remaining</div>
      </div>

      <ul className="category-list">
        {categoriesToDisplay.map((cat) => (
          <div
            key={cat._id}
            className={`budget-item ${cat.remaining < 0 ? "over-budget" : ""}`}
          >
            <div className="budget-row">
              <div className="category-name">{cat.name}</div>
              <div className="category-budget">${cat.adjustedBudget.toFixed(2)}</div>
              <div className="category-spent">${cat.spent.toFixed(2)}</div>
              <div className="category-remaining">${cat.remaining.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </ul>

      {adjustedCategories.length > 3 && (
        <button
          className="see-more-btn"
          onClick={() => setShowAllCategories(!showAllCategories)}
        >
          {showAllCategories ? (
            <>
              See Less <ArrowDropUpIcon />
            </>
          ) : (
            <>
              See More <ArrowDropDownIcon />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default BudgetSummary;
