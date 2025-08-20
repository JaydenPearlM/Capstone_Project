import React from "react";

export default function QuickActions({
  setTxForm,
  setTxEditing,
  setShowTransactionModal,
  setCatForm,
  setCatEditing,
  setShowCategoryModal,
}) {
  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <button
        className="add-btn"
        onClick={() => {
          setTxForm({ id: null, categoryId: "", amount: "", description: "", type: "expense", date: "" });
          setTxEditing(false);
          setShowTransactionModal(true);
        }}
      >
        + Add Transaction
      </button>
      <button
        className="add-btn"
        onClick={() => {
          setCatForm({ id: null, name: "", budget: "", budgetPeriod: "monthly", isRecurring: true });
          setCatEditing(false);
          setShowCategoryModal(true);
        }}
      >
        + Add Category
      </button>
    </div>
  );
}
