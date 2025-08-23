import React from 'react';

const AddDebtForm = ({ 
    formData, 
    setFormData, 
    onSubmit, 
    onCancel 
}) => {
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="name">Debt Name</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Chase Credit Card"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="balance">Current Balance ($)</label>
                <input
                    type="number"
                    id="balance"
                    value={formData.balance}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="interestRate">Interest Rate (%)</label>
                <input
                    type="number"
                    id="interestRate"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    placeholder="17.99"
                    min="0"
                    step="0.01"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="minimumPayment">Minimum Payment ($)</label>
                <input
                    type="number"
                    id="minimumPayment"
                    value={formData.minimumPayment}
                    onChange={(e) => handleInputChange('minimumPayment', e.target.value)}
                    placeholder="95"
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="type">Debt Type</label>
                <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                >
                    <option value="credit_card">Credit Card</option>
                    <option value="student_loan">Student Loan</option>
                    <option value="auto_loan">Auto Loan</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="personal_loan">Personal Loan</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div className="form-actions">
                <button type="button" className="action-btn secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="action-btn primary">
                    Add Debt
                </button>
            </div>
        </form>
    );
};

export default AddDebtForm;