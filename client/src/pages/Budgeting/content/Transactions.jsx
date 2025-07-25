import React from 'react';
import "./Transactions.css";

const Transactions = ({ transactions, categories, setTxForm, setTxEditing, deleteTransaction }) => {
  return (
    <div className="transactions-section">
      <h2>Transactions</h2>
      <div className="transaction-headers">
        <div className="col-amount">Amount</div>
        <div className="col-description">Description</div>
        <div className="col-category">Category</div>
        <div className="col-actions">Actions</div>
      </div>
      <ul className="transaction-list">
        {transactions.map((tx) => {
          const category = categories.find((c) => c.id === tx.categoryId);
          return (
            <li key={tx.id} className="transaction-row">
              <div className="col-amount">${Number(tx.amount).toFixed(2)}</div>
              <div className="col-description">{tx.description}</div>
              <div className="col-category">{category?.name || "Uncategorized"}</div>
              <div className="col-actions">
                <button onClick={() => {
                  setTxForm(tx);
                  setTxEditing(true);
                }}>Edit</button>
                <button onClick={() => deleteTransaction(tx.id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transactions;