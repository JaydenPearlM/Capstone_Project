import React from 'react';

const OverviewCard = ({ title, icon, children }) => (
    <div className="card overview-card">
        <div className="card-header">
            <h3>{title}</h3>
            <span className={`card-icon ${icon}`}>
                {icon === 'debt-icon' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                )}
                {icon === 'payment-icon' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
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

const TotalDebtCard = ({ debtData, debts }) => (
    <OverviewCard title="Total Debt" icon="debt-icon">
        <div className="amount-display debt-amount">
            ${debtData.totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="debt-breakdown">
            {debts.slice(0, 3).map(debt => (
                <div key={debt.id} className="breakdown-item">
                    <span className="breakdown-name">{debt.name}</span>
                    <span className="breakdown-amount debt-red">
                        ${debt.currentBalance.toFixed(2)}
                    </span>
                </div>
            ))}
            {debts.length > 3 && (
                <div className="breakdown-item">
                    <span className="breakdown-name">+{debts.length - 3} more debts</span>
                </div>
            )}
        </div>
    </OverviewCard>
);

const MonthlyPaymentsCard = ({ debtData }) => (
    <OverviewCard title="Minimum Monthly Payments" icon="payment-icon">
        <div className="goal-amount">
            ${debtData.monthlyPayments.toLocaleString('en-US')} / month
        </div>
        <div className="interest-info">
            <div className="interest-rate">
                Avg. Interest Rate: {debtData.averageInterestRate.toFixed(1)}%
            </div>
        </div>
        <div className="remaining-amount">Focus on highest interest first</div>
    </OverviewCard>
);

const QuickActionsCard = ({ onAddDebt, onMakePayment, hasDebts }) => (
    <OverviewCard title="Quick Actions" icon="actions-icon">
        <div className="action-buttons">
            <button className="action-btn primary" onClick={onAddDebt}>
                Add New Debt
            </button>
            <button 
                className="action-btn secondary" 
                onClick={() => {
                    if (!hasDebts) {
                        alert("Please add a debt first!");
                        return;
                    }
                    onMakePayment();
                }}
            >
                Make Payment
            </button>
        </div>
    </OverviewCard>
);

const DebtOverview = ({ 
    debtData, 
    debts, 
    onAddDebt, 
    onMakePayment 
}) => {
    return (
        <div className="overview-row">
            <TotalDebtCard debtData={debtData} debts={debts} />
            <MonthlyPaymentsCard debtData={debtData} />
            <QuickActionsCard 
                onAddDebt={onAddDebt}
                onMakePayment={onMakePayment}
                hasDebts={debts.length > 0}
            />
        </div>
    );
};

export default DebtOverview;