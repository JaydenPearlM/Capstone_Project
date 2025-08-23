import React from 'react';

const EditDebtForm = ({ 
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
                <label htmlFor="editName">Debt Name</label>
                <input
                    type="text"
                    id="editName"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editBalance">Current Balance ($)</label>
                <input
                    type="number"
                    id="editBalance"
                    value={formData.balance}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editInterestRate">Interest Rate (%)</label>
                <input
                    type="number"
                    id="editInterestRate"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    placeholder="17.99"
                    min="0"
                    step="0.01"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editMinimumPayment">Minimum Payment ($)</label>
                <input
                    type="number"
                    id="editMinimumPayment"
                    value={formData.minimumPayment}
                    onChange={(e) => handleInputChange('minimumPayment', e.target.value)}
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editType">Debt Type</label>
                <select
                    id="editType"
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
                    Update Debt
                </button>
            </div>
        </form>
    );
};

export default EditDebtForm;