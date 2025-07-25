import React from 'react';
import './Categories.css';

const Categories = ({ categories, transactions, setCatForm, setCatEditing, deleteCategory }) => {
  const getSpending = (id) =>
    transactions.filter((tx) => tx.categoryId === id).reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <div className="category-headers">
        <div className="col-name">Category</div>
        <div className="col-budget">Budget</div>
        <div className="col-spent">Spent</div>
        <div className="col-actions">Actions</div>
      </div>
      <ul className="category-list">
        {categories.map((cat) => {
          const spent = getSpending(cat.id);
          return (
            <li key={cat.id} className={`category-row ${spent > cat.budget ? 'over-budget' : ''}`}>
              <div className={`col-name ${spent > cat.budget ? 'over-budget-name' : ''}`}>{cat.name}</div>
              <div className="col-budget">${Number(cat.budget).toFixed(2)}</div>
              <div className="col-spent">${spent.toFixed(2)}</div>
              <div className="col-actions">
                <button onClick={() => {
                  setCatForm(cat);
                  setCatEditing(true);
                }}>Edit</button>
                <button onClick={() => deleteCategory(cat.id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;