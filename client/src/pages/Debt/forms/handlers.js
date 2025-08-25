export const apiCall = async (endpoint, method = 'GET', body = null, authFetch) => {
    const config = {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body && { body: JSON.stringify(body) })
    };
    const response = await authFetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
    if (!response.ok) throw new Error(await response.text());
    return method === 'DELETE' ? null : response.json();
};

export const handleSubmit = async (e, endpoint, method, formData, successCallback, authFetch) => {
    e.preventDefault();
    try {
        await apiCall(endpoint, method, formData, authFetch);
        successCallback();
    } catch (error) {
        console.error("API Error:", error);
        alert('Error: ' + error.message);
        throw error;
    }
};

export const handleAddDebt = async (e, formData, callbacks, authFetch) => {
    const { resetForm, closeModal, refreshData } = callbacks;
    
    await handleSubmit(e, '/debts', 'POST', {
        name: formData.name,
        balance: parseFloat(formData.balance),
        interestRate: parseFloat(formData.interestRate) || 0,
        minimumPayment: parseFloat(formData.minimumPayment),
        type: formData.type
    }, () => {
        resetForm();
        closeModal();
        refreshData();
    }, authFetch);
};

export const handleEditDebt = async (e, formData, selectedDebt, callbacks, authFetch) => {
    const { resetForm, closeModal, refreshData } = callbacks;
    
    await handleSubmit(e, `/debts/${selectedDebt.id}`, 'PUT', {
        name: formData.name,
        currentBalance: parseFloat(formData.balance),
        interestRate: parseFloat(formData.interestRate) || 0,
        minimumPayment: parseFloat(formData.minimumPayment),
        type: formData.type
    }, () => {
        resetForm();
        closeModal();
        refreshData();
    }, authFetch);
};

export const handlePayment = async (e, paymentAmount, selectedDebt, callbacks, authFetch) => {
    const { closeModal, refreshData, resetPaymentForm } = callbacks;
    
    await handleSubmit(e, `/debts/${selectedDebt.id}/payment`, 'POST', {
        amount: parseFloat(paymentAmount)
    }, () => {
        resetPaymentForm();
        closeModal();
        refreshData();
    }, authFetch);
};

export const deleteDebt = async (debtId, debtName, refreshData, authFetch) => {
    if (!window.confirm(`Are you sure you want to delete "${debtName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiCall(`/debts/${debtId}`, 'DELETE', null, authFetch);
        refreshData();
    } catch (error) {
        console.error("Error deleting debt:", error);
        alert('Error deleting debt: ' + error.message);
    }
};

export const fetchDebtData = async (setDebtData, setDebts, setLoading, authFetch) => {
    try {
        const data = await apiCall('/debts', 'GET', null, authFetch);
        setDebtData({
            totalDebt: data.totalDebt,
            monthlyPayments: data.monthlyPayments,
            averageInterestRate: data.averageInterestRate,
            debtFreeDate: data.debtFreeDate
        });
        setDebts(data.debts);
    } catch (error) {
        console.error("Error fetching debt data:", error);
    } finally {
        setLoading(false);
    }
};