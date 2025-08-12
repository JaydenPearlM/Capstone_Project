import React from 'react';
import "./Transactions.css";

const Transactions = ({ transactions, categories, setTxForm, setTxEditing, deleteTransaction }) => {
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.slice(0, 10).split("-");
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="transactions-section">
      <h2>Transactions</h2>
      <div className="transaction-headers">
        <div className="col-amount">Amount</div>
        <div className="col-description">Description</div>
        <div className="col-category">Category</div>
        <div className="col-type">Type</div>
        <div className="col-date">Date</div>
        <div className="col-actions">Actions</div>
      </div>
      <ul className="transaction-list">
        {transactions.map((tx) => {
          return (
            <li key={tx._id} className="transaction-row">
              <div className="col-amount">${Number(tx.amount).toFixed(2)}</div>
              <div className="col-description">{tx.description}</div>
              <div className="col-category">{tx.categoryId?.name || "Uncategorized"}</div>
              <div className="col-type">{tx.type}</div>
              <div className="col-date">{formatDate(tx.date)}</div>
              <div className="col-actions">
                <button className="tx-edit-btn"onClick={() => {
                  setTxForm({
                    ...tx,
                    categoryId: tx.categoryId?._id || tx.categoryId
                  });
                  setTxEditing(true);
                }}>
                  Edit
                </button>
                <button className="tx-del-btn" onClick={() => deleteTransaction(tx._id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transactions;