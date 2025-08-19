export async function handleCategorySubmit(
  e,
  catForm,
  catEditing,
  categories,
  setCategories,
  setCatForm,
  setCatEditing,
  authFetch
) {
  e.preventDefault();
  const budgetNum = Number(catForm.budget);
  if (!catForm.name || isNaN(budgetNum) || budgetNum < 0) {
    alert('Please enter valid category name and budget');
    return;
  }

  try {
    if (catEditing) {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories/${catForm._id}`, {
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories/${catForm._id}`, {
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catForm.name, budget: budgetNum })
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      const updated = await res.json();
      setCategories(prev => prev.map(cat => cat._id === catForm._id ? updated : cat));
    } else {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories`, {
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catForm.name, budget: budgetNum })
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      const created = await res.json();
      setCategories(prev => [...prev, created]);
    }

    setCatForm({ id: null, name: '', budget: '' });
    setCatEditing(false);
  } catch (err) {
    alert(`Failed to save category: ${err.message}`);
  }
}

export async function deleteCategory(catId, setCategories, setTransactions, authFetch) {
  if (window.confirm('Deleting this category will also delete all related transactions. Continue?')) {
    try {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories/${catId}`, { method: 'DELETE' });
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories/${catId}`, { method: 'DELETE' });
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      setCategories(prev => prev.filter(cat => cat._id !== catId));
      setTransactions(prev => prev.filter(tx => tx.categoryId !== catId));
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
    }
  }
}

export async function handleTransactionSubmit(
  e,
  txForm,
  txEditing,
  transactions,
  setTransactions,
  setTxForm,
  setTxEditing,
  authFetch,
  categories
) {
  e.preventDefault();
  const amountNum = Number(txForm.amount);
  if (!txForm.description || !txForm.categoryId || isNaN(amountNum) || amountNum <= 0) {
    alert('Please enter valid transaction details');
    return;
  }

  const body = {
    ...txForm,
    amount: amountNum,
    categoryId: txForm.categoryId,
    type: txForm.type,
    date: new Date(txForm.date)
  };

  try {
    if (txEditing) {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${txForm._id}`, {
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions/${txForm._id}`, {
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      const updated = await res.json();
      const categoryObj = categories.find(cat => cat._id === updated.categoryId) || null;

      setTransactions(prev =>
        prev.map(tx =>
          tx._id === txForm._id ? { ...updated, category: categoryObj } : tx
        )
      );
    } else {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions`, {
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      const created = await res.json();
      const categoryObj = categories.find(cat => cat._id === created.categoryId) || null;

      setTransactions(prev => [...prev, { ...created, category: categoryObj }]);
    }

    setTxForm({ id: null, categoryId: '', amount: '', description: '', type: 'expense', date: '' });
    setTxEditing(false);
  } catch (err) {
    alert(`Failed to save transaction: ${err.message}`);
  }
}

export async function deleteTransaction(txId, setTransactions, authFetch) {
  if (window.confirm('Delete this transaction?')) {
    try {
<<<<<<< HEAD
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${txId}`, { method: 'DELETE' });
=======
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions/${txId}`, { method: 'DELETE' });
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error ${res.status}: ${errorText}`);
        return;
      }

      setTransactions(prev => prev.filter(tx => tx._id !== txId));
    } catch (err) {
      alert(`Failed to delete transaction: ${err.message}`);
    }
  }
}
