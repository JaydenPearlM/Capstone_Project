import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for fetching user's categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authFetch } = useAuth();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await authFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        return { success: true, data: newCategory };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await authFetch(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(prev => 
          prev.map(cat => cat._id === id ? updatedCategory : cat)
        );
        return { success: true, data: updatedCategory };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await authFetch(`/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

// Custom hook for fetching user's transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authFetch } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const response = await authFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
      
      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions(prev => [...prev, newTransaction]);
        return { success: true, data: newTransaction };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
  };
};

// Custom hook for fetching budget summary
export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authFetch } = useAuth();

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/budget');
      if (response.ok) {
        const data = await response.json();
        setBudget(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch budget');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return {
    budget,
    loading,
    error,
    refetch: fetchBudget,
  };
};
