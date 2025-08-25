import React from "react";
import "./Transactions.css";

const Transactions = ({
  transactions,
  categories,
  setTxForm,
  setTxEditing,
  setShowTransactionModal,
  deleteTransaction,
  dateRange,
}) => {
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.slice(0, 10).split("-");
    return `${month}/${day}/${year}`;
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredTransactions = dateRange
    ? transactions.filter((tx) => {
        const pad = (n) => n.toString().padStart(2, "0");
        const startStr = `${dateRange.start.getFullYear()}-${pad(dateRange.start.getMonth() + 1)}-${pad(dateRange.start.getDate())}`;
        const endStr = `${dateRange.end.getFullYear()}-${pad(dateRange.end.getMonth() + 1)}-${pad(dateRange.end.getDate())}`;
        const txDateStr = tx.date.slice(0, 10);
        return txDateStr >= startStr && txDateStr <= endStr;
      })
    : transactions;

  return (
    <div className="transactions-section">
      <h2>Transactions</h2>
      {dateRange && (
        <p className="current-period">
          Current Period: {formatDisplayDate(dateRange.start)} -{" "}
          {formatDisplayDate(dateRange.end)}
        </p>
      )}

      <div className="transaction-headers">
        <div className="col-amount">Amount</div>
        <div className="col-description">Description</div>
        <div className="col-category">Category</div>
        <div className="col-type">Type</div>
        <div className="col-date">Date</div>
        <div className="col-actions">Actions</div>
      </div>

      <ul className="transaction-list">
        {filteredTransactions.map((tx) => {
          let categoryName =
            (typeof tx.categoryId === "object" && tx.categoryId?.name) ||
            categories.find((c) => c._id === tx.categoryId)?.name ||
            "Uncategorized";

          return (
            <li key={tx._id} className="transaction-row">
              <div className="col-amount">${Number(tx.amount).toFixed(2)}</div>
              <div className="col-description">{tx.description}</div>
              <div className="col-category">{categoryName}</div>
              <div className="col-type">{tx.type}</div>
              <div className="col-date">{formatDate(tx.date)}</div>
              <div className="col-actions">
                <button
                  className="tx-edit-btn"
                  onClick={() => {
                    setTxForm({
                      ...tx,
                      categoryId:
                        typeof tx.categoryId === "object"
                          ? tx.categoryId._id
                          : tx.categoryId,
                    });
                    setTxEditing(tx);         // 👈 pass the tx object instead of just true
                    setShowTransactionModal(true); // 👈 open modal
                  }}
                >
                  Edit
                </button>
                <button
                  className="tx-del-btn"
                  onClick={() => deleteTransaction(tx._id)}
                >
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

export default Transactions;
