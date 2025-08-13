import React, { useState, useEffect } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import "./Savings.css";

export default function Savings() {
    const [savingsData, setSavingsData] = useState({
        totalSavings: 0,
        monthlyContribution: 0,
        savingsGoal: 0,
        goalProgress: 0
    });
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddGoalForm, setShowAddGoalForm] = useState(false);
    const [showContributeForm, setShowContributeForm] = useState(false);
    const [showEditGoalForm, setShowEditGoalForm] = useState(false);
    const [selectedGoalForContribution, setSelectedGoalForContribution] = useState(null);
    const [selectedGoalForEdit, setSelectedGoalForEdit] = useState(null);


    const [newGoalForm, setNewGoalForm] = useState({
        title: '',
        goalAmount: '',
        targetDate: ''
    });
    const [editGoalForm, setEditGoalForm] = useState({
        title: '',
        goalAmount: '',
        targetDate: ''
    });
    const [contributionForm, setContributionForm] = useState({
        amount: ''
    });

    const fetchSavingsData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savings`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch savings data");
            }
            
            const goals = await response.json();
            
            const totalSavings = goals.reduce((sum, goal) => {
                const goalTotal = goal.contributions.reduce((contribSum, contrib) => contribSum + contrib.amount, 0);
                return sum + goalTotal;
            }, 0);
            
            const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.goalAmount, 0);
            const overallProgress = totalGoalAmount > 0 ? Math.round((totalSavings / totalGoalAmount) * 100) : 0;
            
            setSavingsData({
                totalSavings,
                monthlyContribution: 500, 
                savingsGoal: totalGoalAmount,
                goalProgress: overallProgress
            });
            
            const transformedGoals = goals.map(goal => {
                const currentAmount = goal.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
                const goalProgress = goal.goalAmount > 0 ? Math.round((currentAmount / goal.goalAmount) * 100) : 0;
                return {
                    id: goal._id,
                    title: goal.title,
                    currentAmount: currentAmount,
                    goalAmount: goal.goalAmount,
                    progress: goalProgress,
                    targetDate: goal.targetDate,
                    contributions: goal.contributions,
                    remaining: goal.goalAmount - currentAmount
                };
            });
            
            setSavingsGoals(transformedGoals);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching savings data:", error);
            setLoading(false);
        }
    };

    // HANDLER FUNCTIONS
    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newGoalForm.title,
                    goalAmount: parseFloat(newGoalForm.goalAmount),
                    targetDate: newGoalForm.targetDate || null
                })
            });
            
            if (response.ok) {
                setNewGoalForm({ title: '', goalAmount: '', targetDate: '' });
                setShowAddGoalForm(false);
                fetchSavingsData();
            } else {
                alert('Error adding goal. Please try again.');
            }
        } catch (error) {
            console.error("Error adding goal:", error);
            alert('Error adding goal. Please try again.');
        }
    };

    const handleContribution = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savings/${selectedGoalForContribution.id}/contribute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(contributionForm.amount) })
            });
            
            if (response.ok) {
                setContributionForm({ amount: '' });
                setShowContributeForm(false);
                setSelectedGoalForContribution(null);
                fetchSavingsData();
            } else {
                alert('Error making contribution. Please try again.');
            }
        } catch (error) {
            console.error("Error making contribution:", error);
            alert('Error making contribution. Please try again.');
        }
    };

    const handleEditGoal = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savings/${selectedGoalForEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editGoalForm.title,
                    goalAmount: parseFloat(editGoalForm.goalAmount),
                    targetDate: editGoalForm.targetDate || null
                })
            });
            
            if (response.ok) {
                setEditGoalForm({ title: '', goalAmount: '', targetDate: '' });
                setShowEditGoalForm(false);
                setSelectedGoalForEdit(null);
                fetchSavingsData();
            } else {
                alert('Error updating goal. Please try again.');
            }
        } catch (error) {
            console.error("Error updating goal:", error);
            alert('Error updating goal. Please try again.');
        }
    };

    const handleDeleteGoal = async (goalId, goalTitle) => {
        if (window.confirm(`Are you sure you want to delete "${goalTitle}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/savings/${goalId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    fetchSavingsData();
                } else {
                    alert('Error deleting goal. Please try again.');
                }
            } catch (error) {
                console.error("Error deleting goal:", error);
                alert('Error deleting goal. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchSavingsData();
    }, []);

    if (loading) return <p>Loading savings data...</p>;

    return (
        <div>
            <header>
                <NavBar />
            </header>
           
            <div className="savings-container">
                <SideBar />
                <div className="savings-content">
                    {/* Overview Cards Row */}
                    <div className="overview-row">
                        {/* Total Savings Card */}
                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Total Savings</h3>
                                <span className="card-icon savings-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="1" x2="12" y2="23"/>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="amount-display">
                                    ${savingsData.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="savings-breakdown">
                                    {savingsGoals.slice(0, 3).map(goal => (
                                        <div key={goal.id} className="breakdown-item">
                                            <span className="breakdown-name">{goal.title}</span>
                                            <span className="breakdown-amount">${goal.currentAmount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {savingsGoals.length > 3 && (
                                        <div className="breakdown-item">
                                            <span className="breakdown-name">+{savingsGoals.length - 3} more goals</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress Card */}
                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Overall Progress</h3>
                                <span className="card-icon goal-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-9-9v9z"/>
                                        <path d="M12 3a9 9 0 0 1 9 9"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="goal-amount">
                                    ${savingsData.savingsGoal.toLocaleString('en-US')} Goal
                                </div>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${savingsData.goalProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{savingsData.goalProgress}% Complete</span>
                                </div>
                                <div className="remaining-amount">
                                    ${(savingsData.savingsGoal - savingsData.totalSavings).toFixed(2)} remaining
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Quick Actions</h3>
                                <span className="card-icon actions-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="action-buttons">
                                    <button 
                                        className="action-btn primary"
                                        onClick={() => setShowAddGoalForm(true)}
                                    >
                                        Add New Goal
                                    </button>
                                    <button 
                                        className="action-btn secondary"
                                        onClick={() => {
                                            if (savingsGoals.length === 0) {
                                                alert("Please add a savings goal first!");
                                                return;
                                            }
                                            setShowContributeForm(true);
                                        }}
                                    >
                                        Make Deposit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Individual Goals Section */}
                    <div className="goals-section">
                        <h2>Your Savings Goals</h2>
                        {savingsGoals.length === 0 ? (
                            <div className="no-goals">
                                <p>No savings goals yet. Create your first goal to get started!</p>
                                <button 
                                    className="action-btn primary"
                                    onClick={() => setShowAddGoalForm(true)}
                                >
                                    Create First Goal
                                </button>
                            </div>
                        ) : (
                            <div className="goals-grid">
                                {savingsGoals.map(goal => (
                                    <div key={goal.id} className="goal-card">
                                        <div className="goal-header">
                                            <h3>{goal.title}</h3>
                                            <div className="goal-progress-circle">
                                                <span>{goal.progress}%</span>
                                            </div>
                                        </div>
                                        <div className="goal-content">
                                            <div className="goal-amounts">
                                                <div className="current-amount">
                                                    <span className="amount-label">Current</span>
                                                    <span className="amount">${goal.currentAmount.toFixed(2)}</span>
                                                </div>
                                                <div className="goal-amount">
                                                    <span className="amount-label">Goal</span>
                                                    <span className="amount">${goal.goalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${goal.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="goal-details">
                                                <div className="remaining">
                                                    ${goal.remaining.toFixed(2)} remaining
                                                </div>
                                                {goal.targetDate && (
                                                    <div className="target-date">
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                className="contribute-btn"
                                                onClick={() => {
                                                    setSelectedGoalForContribution(goal);
                                                    setShowContributeForm(true);
                                                }}
                                            >
                                                Contribute to {goal.title}
                                            </button>
                                            <div className="goal-actions">
                                                <button 
                                                    className="goal-action-btn edit"
                                                    onClick={() => {
                                                        setSelectedGoalForEdit(goal);
                                                        setEditGoalForm({
                                                            title: goal.title,
                                                            goalAmount: goal.goalAmount.toString(),
                                                            targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : ''
                                                        });
                                                        setShowEditGoalForm(true);
                                                    }}
                                                >
                                                    Edit Goal
                                                </button>
                                                <button 
                                                    className="goal-action-btn delete"
                                                    onClick={() => handleDeleteGoal(goal.id, goal.title)}
                                                >
                                                    Delete Goal
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Goal Form Modal */}
                    {showAddGoalForm && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Add New Savings Goal</h3>
                                <form onSubmit={handleAddGoal}>
                                    <div className="form-group">
                                        <label htmlFor="title">Goal Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={newGoalForm.title}
                                            onChange={(e) => setNewGoalForm({...newGoalForm, title: e.target.value})}
                                            placeholder="e.g., Emergency Fund, Vacation"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="goalAmount">Goal Amount ($)</label>
                                        <input
                                            type="number"
                                            id="goalAmount"
                                            value={newGoalForm.goalAmount}
                                            onChange={(e) => setNewGoalForm({...newGoalForm, goalAmount: e.target.value})}
                                            placeholder="5000"
                                            min="1"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="targetDate">Target Date (Optional)</label>
                                        <input
                                            type="date"
                                            id="targetDate"
                                            value={newGoalForm.targetDate}
                                            onChange={(e) => setNewGoalForm({...newGoalForm, targetDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            className="action-btn secondary"
                                            onClick={() => setShowAddGoalForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="action-btn primary">
                                            Create Goal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Goal Form Modal */}
                    {showEditGoalForm && selectedGoalForEdit && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Edit Savings Goal</h3>
                                <form onSubmit={handleEditGoal}>
                                    <div className="form-group">
                                        <label htmlFor="editTitle">Goal Title</label>
                                        <input
                                            type="text"
                                            id="editTitle"
                                            value={editGoalForm.title}
                                            onChange={(e) => setEditGoalForm({...editGoalForm, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="editGoalAmount">Goal Amount ($)</label>
                                        <input
                                            type="number"
                                            id="editGoalAmount"
                                            value={editGoalForm.goalAmount}
                                            onChange={(e) => setEditGoalForm({...editGoalForm, goalAmount: e.target.value})}
                                            min="1"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="editTargetDate">Target Date (Optional)</label>
                                        <input
                                            type="date"
                                            id="editTargetDate"
                                            value={editGoalForm.targetDate}
                                            onChange={(e) => setEditGoalForm({...editGoalForm, targetDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            className="action-btn secondary"
                                            onClick={() => {
                                                setShowEditGoalForm(false);
                                                setSelectedGoalForEdit(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="action-btn primary">
                                            Update Goal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Contribute Form Modal */}
                    {showContributeForm && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Make a Contribution</h3>
                                {!selectedGoalForContribution ? (
                                    <div>
                                        <p>Select a goal to contribute to:</p>
                                        <div className="goal-selection">
                                            {savingsGoals.map(goal => (
                                                <div 
                                                    key={goal.id} 
                                                    className="goal-selector"
                                                    onClick={() => setSelectedGoalForContribution(goal)}
                                                >
                                                    <div className="selector-content">
                                                        <span className="selector-title">{goal.title}</span>
                                                        <span className="selector-progress">
                                                            ${goal.currentAmount.toFixed(2)} / ${goal.goalAmount.toFixed(2)} ({goal.progress}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            className="action-btn secondary"
                                            onClick={() => setShowContributeForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContribution}>
                                        <div className="contribution-info">
                                            <p><strong>Contributing to:</strong> {selectedGoalForContribution.title}</p>
                                            <p><strong>Current Progress:</strong> ${selectedGoalForContribution.currentAmount.toFixed(2)} / ${selectedGoalForContribution.goalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contributionAmount">Contribution Amount ($)</label>
                                            <input
                                                type="number"
                                                id="contributionAmount"
                                                value={contributionForm.amount}
                                                onChange={(e) => setContributionForm({...contributionForm, amount: e.target.value})}
                                                placeholder="100"
                                                min="0.01"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                className="action-btn secondary"
                                                onClick={() => {
                                                    setShowContributeForm(false);
                                                    setSelectedGoalForContribution(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="action-btn primary">
                                                Add Contribution
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}