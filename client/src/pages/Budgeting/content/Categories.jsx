import React from "react";
import "./Categories.css";

const Categories = ({ categories, transactions, setCatForm, setCatEditing, deleteCategory, view, biweeklyStart }) => {
  // Helper: get current period date range based on view
  const getPeriodRange = (date, view, biweeklyStart) => {
    const d = new Date(date);
    if (view === "weekly") {
      const start = new Date(d);
      start.setDate(start.getDate() - start.getDay()); // Sunday start
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }
    if (view === "biweekly") {
      if (!biweeklyStart) return { start: new Date(0), end: new Date() };
      const startRef = new Date(biweeklyStart);
      const diffDays = Math.floor((d - startRef) / (1000 * 60 * 60 * 24));
      const periodIndex = Math.floor(diffDays / 14);
      const start = new Date(startRef);
      start.setDate(startRef.getDate() + periodIndex * 14);
      const end = new Date(start);
      end.setDate(start.getDate() + 13);
      return { start, end };
    }
    if (view === "monthly") {
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return { start, end };
    }
    return { start: new Date(0), end: new Date() };
  };

  const currentRange = getPeriodRange(new Date(), view, biweeklyStart);

  // Calculate total spending in current period per category
  const getSpending = (id) => 
    transactions
      .filter((tx) => {
        const catId = tx.categoryId?._id || tx.categoryId;
        if (catId !== id) return false;
        const txDate = new Date(tx.date);
        return txDate >= currentRange.start && txDate <= currentRange.end;
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <p>Budget number shown is for the whole month.</p>
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
