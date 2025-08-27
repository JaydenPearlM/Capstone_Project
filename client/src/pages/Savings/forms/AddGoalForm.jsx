import React from 'react';

const AddGoalForm = ({ 
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
                <label htmlFor="title">Goal Title</label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Emergency Fund, Vacation"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="goalAmount">Goal Amount ($)</label>
                <input
                    type="number"
                    id="goalAmount"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange('goalAmount', e.target.value)}
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
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                />
            </div>
            
            <div className="form-actions">
                <button type="button" className="action-btn secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="action-btn primary">
                    Create Goal
                </button>
            </div>
        </form>
    );
};

export default AddGoalForm;