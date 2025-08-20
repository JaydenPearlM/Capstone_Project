import React, { useState, useEffect } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import "./Debt.css";


const Modal = ({ show, title, onClose, children }) => {
    if (!show) return null;
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose} type="button">
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function Debt() {
    const { authFetch } = useAuth();
    const [debtData, setDebtData] = useState({
        totalDebt: 0, monthlyPayments: 0, averageInterestRate: 0, debtFreeDate: null
    });
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddDebtForm, setShowAddDebtForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showEditDebtForm, setShowEditDebtForm] = useState(false);
    const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
    const [selectedDebtForEdit, setSelectedDebtForEdit] = useState(null);

    const [newDebtForm, setNewDebtForm] = useState({
        name: '', balance: '', interestRate: '', minimumPayment: '', type: 'credit_card'
    });
    const [editDebtForm, setEditDebtForm] = useState({
        name: '', balance: '', interestRate: '', minimumPayment: '', type: 'credit_card'
    });
    const [paymentForm, setPaymentForm] = useState({ amount: '' });

    const resetForm = (formSetter) => formSetter({
        name: '', balance: '', interestRate: '', minimumPayment: '', type: 'credit_card'
    });

    const apiCall = async (endpoint, method = 'GET', body = null) => {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(body && { body: JSON.stringify(body) })
        };
        const response = await authFetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
        if (!response.ok) throw new Error(await response.text());
        return method === 'DELETE' ? null : response.json();
    };

    const fetchDebtData = async () => {
        try {
            const data = await apiCall('/debts');
            setDebtData({
                totalDebt: data.totalDebt, monthlyPayments: data.monthlyPayments,
                averageInterestRate: data.averageInterestRate, debtFreeDate: data.debtFreeDate
            });
            setDebts(data.debts);
        } catch (error) {
            console.error("Error fetching debt data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e, endpoint, method, formData, successCallback) => {
        e.preventDefault();
        try {
            await apiCall(endpoint, method, formData);
            successCallback();
            fetchDebtData();
        } catch (error) {
            console.error("API Error:", error);
            alert('Error: ' + error.message);
        }
    };

    const handleAddDebt = (e) => handleSubmit(e, '/debts', 'POST', {
        name: newDebtForm.name,
        balance: parseFloat(newDebtForm.balance),
        interestRate: parseFloat(newDebtForm.interestRate) || 0,
        minimumPayment: parseFloat(newDebtForm.minimumPayment),
        type: newDebtForm.type
    }, () => {
        resetForm(setNewDebtForm);
        setShowAddDebtForm(false);
    });

    const handlePayment = (e) => handleSubmit(e, `/debts/${selectedDebtForPayment.id}/payment`, 'POST', 
        { amount: parseFloat(paymentForm.amount) }, 
        () => {
            setPaymentForm({ amount: '' });
            setShowPaymentForm(false);
            setSelectedDebtForPayment(null);
        }
    );

    const handleEditDebt = (e) => handleSubmit(e, `/debts/${selectedDebtForEdit.id}`, 'PUT', {
        name: editDebtForm.name,
        currentBalance: parseFloat(editDebtForm.balance),
        interestRate: parseFloat(editDebtForm.interestRate) || 0,
        minimumPayment: parseFloat(editDebtForm.minimumPayment),
        type: editDebtForm.type
    }, () => {
        resetForm(setEditDebtForm);
        setShowEditDebtForm(false);
        setSelectedDebtForEdit(null);
    });

    const handleDeleteDebt = async (debtId, debtName) => {
        if (!window.confirm(`Are you sure you want to delete "${debtName}"? This action cannot be undone.`)) return;
        try {
            await apiCall(`/debts/${debtId}`, 'DELETE');
            fetchDebtData();
        } catch (error) {
            console.error("Error deleting debt:", error);
            alert('Error deleting debt: ' + error.message);
        }
    };

    const icons = {
        credit_card: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
        student_loan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
        auto_loan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/><path d="M9 17v-6h-2"/><path d="M15 17v-6h2"/></svg>,
        mortgage: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/></svg>,
        personal_loan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        other: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
    };

    const colors = {
        credit_card: '#FCD5CE', student_loan: '#4ECDC4', auto_loan: '#C7CEEA',
        mortgage: '#B5EAD7', personal_loan: '#FECA57', other: '#DDA0DD'
    };

    const getDebtTypeIcon = (type) => icons[type] || icons.other;
    const getDebtTypeColor = (type) => colors[type] || colors.other;

    useEffect(() => { fetchDebtData(); }, []);

    if (loading) return <p>Loading debt data...</p>;

    return (
        <div>
            <header><NavBar /></header>
            <div className="debt-container">
                <SideBar />
                <div className="debt-content">
                    {/* Overview Cards */}
                    <div className="overview-row">
                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Total Debt</h3>
                                <span className="card-icon debt-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="1" x2="12" y2="23"/>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="amount-display debt-amount">
                                    ${debtData.totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="debt-breakdown">
                                    {debts.slice(0, 3).map(debt => (
                                        <div key={debt.id} className="breakdown-item">
                                            <span className="breakdown-name">{debt.name}</span>
                                            <span className="breakdown-amount debt-red">${debt.currentBalance.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {debts.length > 3 && (
                                        <div className="breakdown-item">
                                            <span className="breakdown-name">+{debts.length - 3} more debts</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Minimum Monthly Payments</h3>
                                <span className="card-icon payment-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="goal-amount">${debtData.monthlyPayments.toLocaleString('en-US')} / month</div>
                                <div className="interest-info">
                                    <div className="interest-rate">Avg. Interest Rate: {debtData.averageInterestRate.toFixed(1)}%</div>
                                </div>
                                <div className="remaining-amount">Focus on highest interest first</div>
                            </div>
                        </div>

                        <div className="card overview-card">
                            <div className="card-header">
                                <h3>Quick Actions</h3>
                                <span className="card-icon actions-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="action-buttons">
                                    <button className="action-btn primary" onClick={() => setShowAddDebtForm(true)}>Add New Debt</button>
                                    <button className="action-btn secondary" onClick={() => {
                                        if (debts.length === 0) { alert("Please add a debt first!"); return; }
                                        setShowPaymentForm(true);
                                    }}>Make Payment</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Debts Section */}
                    <div className="debts-section">
                        <h2>Your Debts</h2>
                        {debts.length === 0 ? (
                            <div className="no-debts">
                                <p>No debts tracked yet. Add your first debt to start managing your payoff journey!</p>
                                <button className="action-btn primary" onClick={() => setShowAddDebtForm(true)}>Add First Debt</button>
                            </div>
                        ) : (
                            <div className="debts-grid">
                                {debts.map(debt => (
                                    <div key={debt.id} className="debt-card">
                                        <div className="debt-header">
                                            <div className="debt-title">
                                                <span className="debt-type-icon" style={{color: getDebtTypeColor(debt.type)}}>
                                                    {getDebtTypeIcon(debt.type)}
                                                </span>
                                                <h3>{debt.name}</h3>
                                            </div>
                                            <div className="debt-progress-circle"><span>{debt.progress}%</span></div>
                                        </div>
                                        <div className="debt-content">
                                            <div className="debt-amounts">
                                                <div className="current-balance">
                                                    <span className="amount-label">Current Balance</span>
                                                    <span className="amount debt-red">${debt.currentBalance.toFixed(2)}</span>
                                                </div>
                                                <div className="paid-amount">
                                                    <span className="amount-label">Amount Paid</span>
                                                    <span className="amount debt-green">${debt.paidAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill debt-progress" style={{ 
                                                    width: `${debt.progress}%`, background: getDebtTypeColor(debt.type)
                                                }}></div>
                                            </div>
                                            <div className="debt-details">
                                                <div className="interest-rate">{debt.interestRate}% APR</div>
                                                <div className="minimum-payment">Min: ${debt.minimumPayment}/month</div>
                                            </div>
                                            <button className="payment-btn" onClick={() => {
                                                setSelectedDebtForPayment(debt);
                                                setShowPaymentForm(true);
                                            }}>Payment made to {debt.name}</button>
                                            <div className="debt-actions">
                                                <button className="debt-action-btn edit" onClick={() => {
                                                    setSelectedDebtForEdit(debt);
                                                    setEditDebtForm({
                                                        name: debt.name, balance: debt.currentBalance.toString(),
                                                        interestRate: debt.interestRate.toString(),
                                                        minimumPayment: debt.minimumPayment.toString(), type: debt.type
                                                    });
                                                    setShowEditDebtForm(true);
                                                }}>Edit Debt</button>
                                                <button className="debt-action-btn delete" onClick={() => handleDeleteDebt(debt.id, debt.name)}>Delete Debt</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Debt Modal */}
                    <Modal 
                        show={showAddDebtForm} 
                        title="Add New Debt" 
                        onClose={() => setShowAddDebtForm(false)}
                    >
                        <form onSubmit={handleAddDebt}>
                            <div className="form-group">
                                <label htmlFor="name">Debt Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newDebtForm.name}
                                    onChange={(e) => setNewDebtForm({...newDebtForm, name: e.target.value})}
                                    placeholder="e.g., Chase Credit Card"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="balance">Current Balance ($)</label>
                                <input
                                    type="number"
                                    id="balance"
                                    value={newDebtForm.balance}
                                    onChange={(e) => setNewDebtForm({...newDebtForm, balance: e.target.value})}
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
                                    value={newDebtForm.interestRate}
                                    onChange={(e) => setNewDebtForm({...newDebtForm, interestRate: e.target.value})}
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
                                    value={newDebtForm.minimumPayment}
                                    onChange={(e) => setNewDebtForm({...newDebtForm, minimumPayment: e.target.value})}
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
                                    value={newDebtForm.type}
                                    onChange={(e) => setNewDebtForm({...newDebtForm, type: e.target.value})}
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
                                <button type="button" className="action-btn secondary" onClick={() => setShowAddDebtForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="action-btn primary">
                                    Add Debt
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Payment Modal */}
                    <Modal 
                        show={showPaymentForm} 
                        title="Make a Payment" 
                        onClose={() => {
                            setShowPaymentForm(false);
                            setSelectedDebtForPayment(null);
                        }}
                    >
                        {!selectedDebtForPayment ? (
                            <div>
                                <p>Select a debt to make a payment:</p>
                                <div className="debt-selection">
                                    {debts.map(debt => (
                                        <div key={debt.id} className="debt-selector" onClick={() => setSelectedDebtForPayment(debt)}>
                                            <div className="selector-content">
                                                <div className="selector-header">
                                                    <span className="selector-icon" style={{color: getDebtTypeColor(debt.type)}}>
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
                                <button className="action-btn secondary" onClick={() => setShowPaymentForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePayment}>
                                <div className="payment-info">
                                    <p><strong>Making payment to:</strong> {selectedDebtForPayment.name}</p>
                                    <p><strong>Current Balance:</strong> ${selectedDebtForPayment.currentBalance.toFixed(2)}</p>
                                    <p><strong>Minimum Payment:</strong> ${selectedDebtForPayment.minimumPayment.toFixed(2)}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="paymentAmount">Payment Amount ($)</label>
                                    <input
                                        type="number"
                                        id="paymentAmount"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                                        placeholder={selectedDebtForPayment.minimumPayment.toString()}
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="action-btn secondary" 
                                        onClick={() => {
                                            setShowPaymentForm(false); 
                                            setSelectedDebtForPayment(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="action-btn primary">
                                        Make Payment
                                    </button>
                                </div>
                            </form>
                        )}
                    </Modal>

                    {/* Edit Debt Modal */}
                    <Modal 
                        show={showEditDebtForm && selectedDebtForEdit} 
                        title="Edit Debt" 
                        onClose={() => {
                            setShowEditDebtForm(false);
                            setSelectedDebtForEdit(null);
                        }}
                    >
                        <form onSubmit={handleEditDebt}>
                            <div className="form-group">
                                <label htmlFor="editName">Debt Name</label>
                                <input
                                    type="text"
                                    id="editName"
                                    value={editDebtForm.name}
                                    onChange={(e) => setEditDebtForm({...editDebtForm, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editBalance">Current Balance ($)</label>
                                <input
                                    type="number"
                                    id="editBalance"
                                    value={editDebtForm.balance}
                                    onChange={(e) => setEditDebtForm({...editDebtForm, balance: e.target.value})}
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
                                    value={editDebtForm.interestRate}
                                    onChange={(e) => setEditDebtForm({...editDebtForm, interestRate: e.target.value})}
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
                                    value={editDebtForm.minimumPayment}
                                    onChange={(e) => setEditDebtForm({...editDebtForm, minimumPayment: e.target.value})}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editType">Debt Type</label>
                                <select
                                    id="editType"
                                    value={editDebtForm.type}
                                    onChange={(e) => setEditDebtForm({...editDebtForm, type: e.target.value})}
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
                                <button 
                                    type="button" 
                                    className="action-btn secondary" 
                                    onClick={() => {
                                        setShowEditDebtForm(false); 
                                        setSelectedDebtForEdit(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="action-btn primary">
                                    Update Debt
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </div>
            <footer><Footer /></footer>
        </div>
    );
}