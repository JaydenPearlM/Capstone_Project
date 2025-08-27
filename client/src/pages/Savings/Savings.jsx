import React, { useState, useEffect } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";

// Form Components
import AddGoalForm from "./forms/AddGoalForm";
import EditGoalForm from "./forms/EditGoalForm";
import ContributionForm from "./forms/ContributionForm";

// Content Components
import SavingsOverview from "./components/SavingsOverview";
import SavingsGoalsList from "./components/SavingsGoalsList";

// Handlers
import {
    handleAddGoal,
    handleEditGoal,
    handleContribution,
    deleteGoal,
    fetchSavingsData
} from "./forms/handlers";

import "./Savings.css";

export default function Savings() {
    const { authFetch } = useAuth();
    
    // Data state
    const [savingsData, setSavingsData] = useState({
        totalSavings: 0,
        monthlyContribution: 0,
        savingsGoal: 0,
        goalProgress: 0
    });
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal visibility state
    const [showAddGoalForm, setShowAddGoalForm] = useState(false);
    const [showContributeForm, setShowContributeForm] = useState(false);
    const [showEditGoalForm, setShowEditGoalForm] = useState(false);
    
    // Track which goal is selected for actions
    const [selectedGoalForContribution, setSelectedGoalForContribution] = useState(null);
    const [selectedGoalForEdit, setSelectedGoalForEdit] = useState(null);

    // Form input state
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
    const [contributionAmount, setContributionAmount] = useState('');

    // Helper: Reset form to initial empty state
    const resetForm = (formSetter) => formSetter({
        title: '',
        goalAmount: '',
        targetDate: ''
    });

    // Reload data from server
    const refreshData = () => {
        fetchSavingsData(setSavingsData, setSavingsGoals, setLoading, authFetch);
    };

    // Form submission handlers: these call the API
    const handleAddGoalSubmit = async (e) => {
        try {
            await handleAddGoal(e, newGoalForm, {
                resetForm: () => resetForm(setNewGoalForm),
                closeModal: () => setShowAddGoalForm(false),
                refreshData
            }, authFetch);
        } catch (error) {
            // Error handling is done in the handler function
        }
    };

    const handleEditGoalSubmit = async (e) => {
        try {
            await handleEditGoal(e, editGoalForm, selectedGoalForEdit, {
                resetForm: () => resetForm(setEditGoalForm),
                closeModal: () => {
                    setShowEditGoalForm(false);
                    setSelectedGoalForEdit(null);
                },
                refreshData
            }, authFetch);
        } catch (error) {
        }
    };

    const handleContributionSubmit = async (e) => {
        try {
            await handleContribution(e, contributionAmount, selectedGoalForContribution, {
                closeModal: () => {
                    setShowContributeForm(false);
                    setSelectedGoalForContribution(null);
                },
                refreshData,
                resetContributionForm: () => setContributionAmount('')
            }, authFetch);
        } catch (error) {     
        }
    };

    // Delete handler with confirmation
    const handleDeleteGoal = async (goalId, goalTitle) => {
        await deleteGoal(goalId, goalTitle, refreshData, authFetch);
    };

    // UI action handlers: these manage modal state and form population
    const openEditGoalModal = (goal) => {
        setSelectedGoalForEdit(goal); 
        setEditGoalForm({
            title: goal.title,
            goalAmount: goal.goalAmount.toString(),
            targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : ''
        });
        setShowEditGoalForm(true); 
    };

    const handleMakeContribution = (goal = null) => {
        if (goal) {
            setSelectedGoalForContribution(goal); 
        }
        setShowContributeForm(true);
    };

    // Modal close handlers: clean up state when closing
    const closeAddGoalModal = () => {
        setShowAddGoalForm(false);
        resetForm(setNewGoalForm);
    };

    const closeEditGoalModal = () => {
        setShowEditGoalForm(false);
        setSelectedGoalForEdit(null);
        resetForm(setEditGoalForm);
    };

    const closeContributionModal = () => {
        setShowContributeForm(false);
        setSelectedGoalForContribution(null);
        setContributionAmount('');
    };

    // Load initial data when component mounts
    useEffect(() => {
        refreshData();
    }, []);

    // Show loading state while fetching data
    if (loading) {
        return <p>Loading savings data...</p>;
    }

    return (
        <div>
            <header><NavBar /></header>

            <div className="savings-container">
                <SideBar />
                
                <div className="savings-content">
                    {/* Summary cards with totals and quick actions */}
                    <SavingsOverview 
                        savingsData={savingsData}
                        savingsGoals={savingsGoals}
                        onAddGoal={() => setShowAddGoalForm(true)}
                        onMakeContribution={() => handleMakeContribution()}
                    />

                    {/* Individual savings goal cards with details */}
                    <div className="goals-section">
                        <h2>Your Savings Goals</h2>
                        <SavingsGoalsList
                            savingsGoals={savingsGoals}
                            onContribute={handleMakeContribution}
                            onEdit={openEditGoalModal}
                            onDelete={handleDeleteGoal}
                            onAddGoal={() => setShowAddGoalForm(true)}
                        />
                    </div>

                    {/* Add Goal Form Modal */}
                    {showAddGoalForm && (
                        <div className="modal-overlay" onClick={closeAddGoalModal}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <h3>Add New Savings Goal</h3>
                                <AddGoalForm
                                    formData={newGoalForm}
                                    setFormData={setNewGoalForm}
                                    onSubmit={handleAddGoalSubmit}
                                    onCancel={closeAddGoalModal}
                                />
                            </div>
                        </div>
                    )}

                    {/* Edit Goal Form Modal */}
                    {showEditGoalForm && selectedGoalForEdit && (
                        <div className="modal-overlay" onClick={closeEditGoalModal}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <h3>Edit Savings Goal</h3>
                                <EditGoalForm
                                    formData={editGoalForm}
                                    setFormData={setEditGoalForm}
                                    onSubmit={handleEditGoalSubmit}
                                    onCancel={closeEditGoalModal}
                                />
                            </div>
                        </div>
                    )}

                    {/* Contribute Form Modal */}
                    {showContributeForm && (
                        <div className="modal-overlay" onClick={closeContributionModal}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <h3>Make a Contribution</h3>
                                <ContributionForm
                                    selectedGoal={selectedGoalForContribution}
                                    contributionAmount={contributionAmount}
                                    setContributionAmount={setContributionAmount}
                                    onSubmit={handleContributionSubmit}
                                    onCancel={closeContributionModal}
                                    goals={savingsGoals}
                                    onGoalSelect={setSelectedGoalForContribution}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer 
                className="footer-strip"
                style={{
                    padding: "6px 0",
                    width: "100vw",
                    marginLeft: "calc(50% - 50vw)",
                    marginRight: "calc(50% - 50vw)"
                }}
            >
                <Footer />
            </footer>
        </div>
    );
}