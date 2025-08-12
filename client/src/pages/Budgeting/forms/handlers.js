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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories/${catForm._id}`, {
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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories`, {
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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories/${catId}`, { method: 'DELETE' });
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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions/${txForm._id}`, {
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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions`, {
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
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions/${txId}`, { method: 'DELETE' });
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
