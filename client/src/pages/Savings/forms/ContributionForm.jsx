import React from 'react';

const GoalSelector = ({ goals, onGoalSelect }) => (
    <div>
        <p>Select a goal to contribute to:</p>
        <div className="goal-selection">
            {goals.map(goal => (
                <div
                    key={goal.id}
                    className="goal-selector"
                    onClick={() => onGoalSelect(goal)}
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
    </div>
);

const ContributionFormContent = ({ 
    selectedGoal, 
    contributionAmount, 
    setContributionAmount, 
    onSubmit 
}) => (
    <form onSubmit={onSubmit}>
        <div className="contribution-info">
            <p><strong>Contributing to:</strong> {selectedGoal.title}</p>
            <p><strong>Current Progress:</strong> ${selectedGoal.currentAmount.toFixed(2)} / ${selectedGoal.goalAmount.toFixed(2)}</p>
        </div>
        
        <div className="form-group">
            <label htmlFor="contributionAmount">Contribution Amount ($)</label>
            <input
                type="number"
                id="contributionAmount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="100"
                min="0.01"
                step="0.01"
                required
            />
        </div>
        
        <div className="form-actions">
            <button type="submit" className="action-btn primary">
                Add Contribution
            </button>
        </div>
    </form>
);

const ContributionForm = ({ 
    selectedGoal, 
    contributionAmount, 
    setContributionAmount,
    onSubmit, 
    onCancel, 
    goals, 
    onGoalSelect 
}) => {
    if (!selectedGoal) {
        return (
            <div>
                <GoalSelector goals={goals} onGoalSelect={onGoalSelect} />
                <div className="form-actions">
                    <button className="action-btn secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ContributionFormContent
                selectedGoal={selectedGoal}
                contributionAmount={contributionAmount}
                setContributionAmount={setContributionAmount}
                onSubmit={onSubmit}
            />
            <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button type="button" className="action-btn secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ContributionForm;