export function handleCategorySubmit(
  e,
  catForm,
  catEditing,
  categories,
  setCategories,
  setCatForm,
  setCatEditing
) {
  e.preventDefault();
  const budgetNum = Number(catForm.budget);
  if (!catForm.name || isNaN(budgetNum) || budgetNum < 0) {
    alert('Please enter valid category name and budget');
    return;
  }

  if (catEditing) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catForm.id ? { ...catForm, budget: budgetNum } : cat
      )
    );
  } else {
    const newCategory = {
      id: categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
      name: catForm.name,
      budget: budgetNum,
    };
    setCategories((prev) => [...prev, newCategory]);
  }

  setCatForm({ id: null, name: '', budget: '' });
  setCatEditing(false);
}

export function deleteCategory(catId, setCategories, setTransactions) {
  if (
    window.confirm(
      'Deleting this category will also delete all related transactions. Continue?'
    )
  ) {
    setCategories((prev) => prev.filter((cat) => cat.id !== catId));
    setTransactions((prev) => prev.filter((tx) => tx.categoryId !== catId));
  }
}

export function handleTransactionSubmit(
  e,
  txForm,
  txEditing,
  transactions,
  setTransactions,
  setTxForm,
  setTxEditing
) {
  e.preventDefault();
  const amountNum = Number(txForm.amount);
  if (
    !txForm.description ||
    !txForm.categoryId ||
    isNaN(amountNum) ||
    amountNum <= 0
  ) {
    alert('Please enter valid transaction details');
    return;
  }

  if (txEditing) {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txForm.id
          ? { ...txForm, amount: amountNum, categoryId: Number(txForm.categoryId) }
          : tx
      )
    );
  } else {
    const newTransaction = {
      id: transactions.length
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1,
      description: txForm.description,
      amount: amountNum,
      categoryId: Number(txForm.categoryId),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  }

  setTxForm({ id: null, categoryId: '', amount: '', description: '' });
  setTxEditing(false);
}

export function deleteTransaction(txId, setTransactions) {
  if (window.confirm('Delete this transaction?')) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
  }
}