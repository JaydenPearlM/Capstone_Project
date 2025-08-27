import React from 'react';

const GoalCard = ({ 
    goal, 
    onContribute, 
    onEdit, 
    onDelete 
}) => (
    <div className="goal-card">
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
                />
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
                onClick={() => onContribute(goal)}
            >
                Contribute to {goal.title}
            </button>
            
            <div className="goal-actions">
                <button
                    className="goal-action-btn edit"
                    onClick={() => onEdit(goal)}
                >
                    Edit Goal
                </button>
                <button
                    className="goal-action-btn delete"
                    onClick={() => onDelete(goal.id, goal.title)}
                >
                    Delete Goal
                </button>
            </div>
        </div>
    </div>
);

const NoGoalsMessage = ({ onAddGoal }) => (
    <div className="no-goals">
        <p>No savings goals yet. Create your first goal to get started!</p>
        <button
            className="action-btn primary"
            onClick={onAddGoal}
        >
            Create First Goal
        </button>
    </div>
);

const SavingsGoalsList = ({ 
    savingsGoals, 
    onContribute, 
    onEdit, 
    onDelete, 
    onAddGoal 
}) => {
    if (savingsGoals.length === 0) {
        return <NoGoalsMessage onAddGoal={onAddGoal} />;
    }

    return (
        <div className="goals-grid">
            {savingsGoals.map(goal => (
                <GoalCard
                    key={goal.id}
                    goal={goal}
                    onContribute={onContribute}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default SavingsGoalsList;