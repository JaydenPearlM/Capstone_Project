import React from 'react';

const DebtSelector = ({ debts, onDebtSelect, getDebtTypeIcon, getDebtTypeColor }) => (
    <div>
        <p>Select a debt to make a payment:</p>
        <div className="debt-selection">
            {debts.map(debt => (
                <div 
                    key={debt.id} 
                    className="debt-selector" 
                    onClick={() => onDebtSelect(debt)}
                >
                    <div className="selector-content">
                        <div className="selector-header">
                            <span 
                                className="selector-icon" 
                                style={{ color: getDebtTypeColor(debt.type) }}
                            >
                                {getDebtTypeIcon(debt.type)}
                            </span>
                            <span className="selector-title">{debt.name}</span>
                        </div>
                        <span className="selector-progress">
                            ${debt.currentBalance.toFixed(2)} at {debt.interestRate}% APR
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PaymentFormContent = ({ 
    selectedDebt, 
    paymentAmount, 
    setPaymentAmount, 
    onSubmit 
}) => (
    <form onSubmit={onSubmit}>
        <div className="payment-info">
            <p><strong>Making payment to:</strong> {selectedDebt.name}</p>
            <p><strong>Current Balance:</strong> ${selectedDebt.currentBalance.toFixed(2)}</p>
            <p><strong>Minimum Payment:</strong> ${selectedDebt.minimumPayment.toFixed(2)}</p>
        </div>
        
        <div className="form-group">
            <label htmlFor="paymentAmount">Payment Amount ($)</label>
            <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder={selectedDebt.minimumPayment.toString()}
                min="0.01"
                step="0.01"
                required
            />
        </div>
        
        <div className="form-actions">
            <button type="submit" className="action-btn primary">
                Make Payment
            </button>
        </div>
    </form>
);

const PaymentForm = ({ 
    selectedDebt, 
    paymentAmount, 
    setPaymentAmount,
    onSubmit, 
    onCancel, 
    debts, 
    onDebtSelect,
    getDebtTypeIcon,
    getDebtTypeColor 
}) => {
    if (!selectedDebt) {
        return (
            <div>
                <DebtSelector
                    debts={debts}
                    onDebtSelect={onDebtSelect}
                    getDebtTypeIcon={getDebtTypeIcon}
                    getDebtTypeColor={getDebtTypeColor}
                />
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
            <PaymentFormContent
                selectedDebt={selectedDebt}
                paymentAmount={paymentAmount}
                setPaymentAmount={setPaymentAmount}
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

export default PaymentForm;