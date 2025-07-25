import React from 'react';
import "./TransactionForm.css";

const TransactionForm = ({
  txForm,
  setTxForm,
  txEditing,
  setTxEditing,
  categories,
  transactions,
  setTransactions,
  handleSubmit
}) => {
  return (
    <form
      className="transaction-form"
      onSubmit={(e) =>
        handleSubmit(
          e,
          txForm,
          txEditing,
          transactions,
          setTransactions,
          setTxForm,
          setTxEditing
        )
      }
    >
      <h3>{txEditing ? 'Edit' : 'Add'} Transaction</h3>

      <div className="form-row">
        <label htmlFor="txDesc">Description:</label>
        <input
          id="txDesc"
          type="text"
          placeholder="Description"
          value={txForm.description}
          onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="txAmount">Amount:</label>
        <input
          id="txAmount"
          type="number"
          placeholder="Amount"
          value={txForm.amount}
          onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="txCategory">Category:</label>
        <select
          id="txCategory"
          value={txForm.categoryId}
          onChange={(e) => setTxForm({ ...txForm, categoryId: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button className="submit-btn" type="submit">
        {txEditing ? 'Update' : 'Add'} Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
