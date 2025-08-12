import React from "react";
import "./Categories.css";

const Categories = ({
  categories,
  transactions,
  setCatForm,
  setCatEditing,
  deleteCategory,
  dateRange,  // pass from Budgeting.jsx
}) => {
  if (!dateRange || !dateRange.start) return null;

  // Ensure dateRange.start is a Date object
  const startDate =
    dateRange.start instanceof Date ? dateRange.start : new Date(dateRange.start);

  // Compute full month range for the month containing dateRange.start
  const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  // Sum spending for each category within that month
  const getSpending = (categoryId) =>
    transactions
      .filter((tx) => {
        const txCatId = tx.categoryId?._id || tx.categoryId;
        if (txCatId !== categoryId) return false;

        const txDate = new Date(tx.date);
        return txDate >= monthStart && txDate <= monthEnd;
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <p>Budget number shown and spent is for the whole month. To see your weekly amount spent and weekly budget number, visit the budget summary section.</p>
      <div className="category-headers">
        <div className="col-name">Category</div>
        <div className="col-budget">Budget</div>
        <div className="col-spent">Spent</div>
        <div className="col-actions">Actions</div>
      </div>
      <ul className="category-list">
        {categories.map((cat) => {
          const spent = getSpending(cat._id);
          return (
            <li key={cat._id} className={`category-row ${spent > cat.budget ? "over-budget" : ""}`}>
              <div className={`col-name ${spent > cat.budget ? "over-budget-name" : ""}`}>{cat.name}</div>
              <div className="col-budget">${Number(cat.budget).toFixed(2)}</div>
              <div className="col-spent">${spent.toFixed(2)}</div>
              <div className="col-actions">
                <button
                  className="cat-edit-btn"
                  onClick={() => {
                    setCatForm(cat);
                    setCatEditing(true);
                  }}
                >
                  Edit
                </button>
                <button className="cat-del-btn" onClick={() => deleteCategory(cat._id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;
