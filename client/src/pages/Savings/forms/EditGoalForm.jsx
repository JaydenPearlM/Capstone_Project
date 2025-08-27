import React from 'react';

const EditGoalForm = ({ 
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
                <label htmlFor="editTitle">Goal Title</label>
                <input
                    type="text"
                    id="editTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editGoalAmount">Goal Amount ($)</label>
                <input
                    type="number"
                    id="editGoalAmount"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                    min="1"
                    step="0.01"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="editTargetDate">Target Date (Optional)</label>
                <input
                    type="date"
                    id="editTargetDate"
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                />
            </div>
            
            <div className="form-actions">
                <button type="button" className="action-btn secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="action-btn primary">
                    Update Goal
                </button>
            </div>
        </form>
    );
};

export default EditGoalForm;