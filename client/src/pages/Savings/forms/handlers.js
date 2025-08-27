// API helper for GET/POST/PUT/DELETE requests
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

// HAndles submitting forms 
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

// Add a new savings goal
export const handleAddGoal = async (e, formData, callbacks, authFetch) => {
    const { resetForm, closeModal, refreshData } = callbacks;
    
    await handleSubmit(e, '/savings', 'POST', {
        title: formData.title,
        goalAmount: parseFloat(formData.goalAmount),
        targetDate: formData.targetDate || null
    }, () => {
        resetForm();
        closeModal();
        refreshData();
    }, authFetch);
};

// Edit existing goal
export const handleEditGoal = async (e, formData, selectedGoal, callbacks, authFetch) => {
    const { resetForm, closeModal, refreshData } = callbacks;
    
    await handleSubmit(e, `/savings/${selectedGoal.id}`, 'PUT', {
        title: formData.title,
        goalAmount: parseFloat(formData.goalAmount),
        targetDate: formData.targetDate || null
    }, () => {
        resetForm();
        closeModal();
        refreshData();
    }, authFetch);
};

// Add a contribution
export const handleContribution = async (e, contributionAmount, selectedGoal, callbacks, authFetch) => {
    const { closeModal, refreshData, resetContributionForm } = callbacks;
    
    await handleSubmit(e, `/savings/${selectedGoal.id}/contribute`, 'POST', {
        amount: parseFloat(contributionAmount)
    }, () => {
        resetContributionForm();
        closeModal();
        refreshData();
    }, authFetch);
};

export const deleteGoal = async (goalId, goalTitle, refreshData, authFetch) => {
    if (!window.confirm(`Are you sure you want to delete "${goalTitle}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await apiCall(`/savings/${goalId}`, 'DELETE', null, authFetch);
        refreshData();
    } catch (error) {
        console.error("Error deleting goal:", error);
        alert('Error deleting goal. Please try again.');
    }
};

export const fetchSavingsData = async (setSavingsData, setSavingsGoals, setLoading, authFetch) => {
    try {
        const data = await apiCall('/savings', 'GET', null, authFetch);
        
        setSavingsData({
            totalSavings: data.totalSavings,
            savingsGoal: data.savingsGoal,
            goalProgress: data.goalProgress
        });

        // Transform goals to match frontend format (backend sends _id, frontend expects id)
        const transformedGoals = data.goals.map(goal => ({
            id: goal._id,
            title: goal.title,
            currentAmount: goal.currentAmount,
            goalAmount: goal.goalAmount,
            progress: goal.progress,
            targetDate: goal.targetDate,
            contributions: goal.contributions,
            remaining: goal.remaining
        }));

        setSavingsGoals(transformedGoals);
    } catch (error) {
        console.error("Error fetching savings data:", error);
    } finally {
        setLoading(false);
    }
};