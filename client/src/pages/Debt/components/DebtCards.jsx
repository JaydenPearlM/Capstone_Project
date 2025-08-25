import React from 'react';

const DebtCard = ({ 
    debt, 
    getDebtTypeIcon, 
    getDebtTypeColor, 
    onMakePayment, 
    onEdit, 
    onDelete 
}) => (
    <div className="debt-card">
        <div className="debt-header">
            <div className="debt-title">
                <span 
                    className="debt-type-icon" 
                    style={{ color: getDebtTypeColor(debt.type) }}
                >
                    {getDebtTypeIcon(debt.type)}
                </span>
                <h3>{debt.name}</h3>
            </div>
            <div className="debt-progress-circle">
                <span>{debt.progress}%</span>
            </div>
        </div>
        
        <div className="debt-content">
            <div className="debt-amounts">
                <div className="current-balance">
                    <span className="amount-label">Current Balance</span>
                    <span className="amount debt-red">
                        ${debt.currentBalance.toFixed(2)}
                    </span>
                </div>
                <div className="paid-amount">
                    <span className="amount-label">Amount Paid</span>
                    <span className="amount debt-green">
                        ${debt.paidAmount.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <div className="progress-bar">
                <div 
                    className="progress-fill debt-progress" 
                    style={{
                        width: `${debt.progress}%`, 
                        background: getDebtTypeColor(debt.type)
                    }}
                />
            </div>
            
            <div className="debt-details">
                <div className="interest-rate">{debt.interestRate}% APR</div>
                <div className="minimum-payment">
                    Min: ${debt.minimumPayment}/month
                </div>
            </div>
            
            <button 
                className="payment-btn" 
                onClick={() => onMakePayment(debt)}
            >
                Payment made to {debt.name}
            </button>
            
            <div className="debt-actions">
                <button 
                    className="debt-action-btn edit" 
                    onClick={() => onEdit(debt)}
                >
                    Edit Debt
                </button>
                <button 
                    className="debt-action-btn delete" 
                    onClick={() => onDelete(debt.id, debt.name)}
                >
                    Delete Debt
                </button>
            </div>
        </div>
    </div>
);

const NoDebtsMessage = ({ onAddDebt }) => (
    <div className="no-debts">
        <p>No debts tracked yet. Add your first debt to start managing your payoff journey!</p>
        <button className="action-btn primary" onClick={onAddDebt}>
            Add First Debt
        </button>
    </div>
);

const DebtList = ({ 
    debts, 
    getDebtTypeIcon, 
    getDebtTypeColor, 
    onMakePayment, 
    onEdit, 
    onDelete, 
    onAddDebt 
}) => {
    if (debts.length === 0) {
        return <NoDebtsMessage onAddDebt={onAddDebt} />;
    }

    return (
        <div className="debts-grid">
            {debts.map(debt => (
                <DebtCard
                    key={debt.id}
                    debt={debt}
                    getDebtTypeIcon={getDebtTypeIcon}
                    getDebtTypeColor={getDebtTypeColor}
                    onMakePayment={onMakePayment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default DebtList;