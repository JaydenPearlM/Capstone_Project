import React from 'react';

const OverviewCard = ({ title, icon, children }) => (
    <div className="card overview-card">
        <div className="card-header">
            <h3>{title}</h3>
            <span className={`card-icon ${icon}`}>
                {icon === 'savings-icon' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                )}
                {icon === 'goal-icon' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9v9z" />
                        <path d="M12 3a9 9 0 0 1 9 9" />
                    </svg>
                )}
                {icon === 'actions-icon' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                )}
            </span>
        </div>
        <div className="card-content">
            {children}
        </div>
    </div>
);

const TotalSavingsCard = ({ savingsData, savingsGoals }) => (
    <OverviewCard title="Total Savings" icon="savings-icon">
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
    </OverviewCard>
);

const OverallProgressCard = ({ savingsData }) => (
    <OverviewCard title="Overall Progress" icon="goal-icon">
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
    </OverviewCard>
);

const QuickActionsCard = ({ onAddGoal, onMakeContribution, hasGoals }) => (
    <OverviewCard title="Quick Actions" icon="actions-icon">
        <div className="action-buttons">
            <button className="action-btn primary" onClick={onAddGoal}>
                Add New Goal
            </button>
            <button 
                className="action-btn secondary" 
                onClick={() => {
                    if (!hasGoals) {
                        alert("Please add a savings goal first!");
                        return;
                    }
                    onMakeContribution();
                }}
            >
                Make Deposit
            </button>
        </div>
    </OverviewCard>
);

const SavingsOverview = ({ 
    savingsData, 
    savingsGoals, 
    onAddGoal, 
    onMakeContribution 
}) => {
    return (
        <div className="overview-row">
            <TotalSavingsCard savingsData={savingsData} savingsGoals={savingsGoals} />
            <OverallProgressCard savingsData={savingsData} />
            <QuickActionsCard 
                onAddGoal={onAddGoal}
                onMakeContribution={onMakeContribution}
                hasGoals={savingsGoals.length > 0}
            />
        </div>
    );
};

export default SavingsOverview;