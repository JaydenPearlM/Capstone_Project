import React, { useState, useEffect } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../contexts/AuthContext";
import AddDebtForm from "./forms/AddDebtForm";
import EditDebtForm from "./forms/EditDebtForm";
import PaymentForm from "./forms/PaymentForm";
import DebtOverview from "./components/DebtOverview";
import DebtCards from "./components/DebtCards";

import { getDebtTypeIcon, getDebtTypeColor } from "./utils/debtTypes.jsx";
import {
    handleAddDebt,
    handleEditDebt,
    handlePayment,
    deleteDebt,
    fetchDebtData
} from "./forms/handlers";

import "./Debt.css";

export default function Debt() {
    const { authFetch } = useAuth();
    
    // server data state 
    const [debtData, setDebtData] = useState({
        totalDebt: 0, 
        monthlyPayments: 0, 
        averageInterestRate: 0, 
        debtFreeDate: null
    });
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal visibility state: tracks which modal is open
    const [showAddDebtForm, setShowAddDebtForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showEditDebtForm, setShowEditDebtForm] = useState(false);
    
    // Selected items state: which debt is selected for actions
    const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
    const [selectedDebtForEdit, setSelectedDebtForEdit] = useState(null);

    // Form data state
    const [newDebtForm, setNewDebtForm] = useState({
        name: '', 
        balance: '', 
        interestRate: '', 
        minimumPayment: '', 
        type: 'credit_card'
    });
    const [editDebtForm, setEditDebtForm] = useState({
        name: '', 
        balance: '', 
        interestRate: '', 
        minimumPayment: '', 
        type: 'credit_card'
    });
    const [paymentAmount, setPaymentAmount] = useState('');

    // Helper that resets a form to empty or default state
    const resetForm = (formSetter) => formSetter({
        name: '', 
        balance: '', 
        interestRate: '', 
        minimumPayment: '', 
        type: 'credit_card'
    });

    const refreshData = () => {
        fetchDebtData(setDebtData, setDebts, setLoading, authFetch);
    };

    // form submission handlers
    const handleAddDebtSubmit = async (e) => {
        try {
            await handleAddDebt(e, newDebtForm, {
                resetForm: () => resetForm(setNewDebtForm),
                closeModal: () => setShowAddDebtForm(false),
                refreshData
            }, authFetch);
        } catch (error) {
        }
    };

    const handleEditDebtSubmit = async (e) => {
        try {
            await handleEditDebt(e, editDebtForm, selectedDebtForEdit, {
                resetForm: () => resetForm(setEditDebtForm),
                closeModal: () => {
                    setShowEditDebtForm(false);
                    setSelectedDebtForEdit(null);
                },
                refreshData
            }, authFetch);
        } catch (error) {
        }
    };

    const handlePaymentSubmit = async (e) => {
        try {
            await handlePayment(e, paymentAmount, selectedDebtForPayment, {
                closeModal: () => {
                    setShowPaymentForm(false);
                    setSelectedDebtForPayment(null);
                },
                refreshData,
                resetPaymentForm: () => setPaymentAmount('')
            }, authFetch);
        } catch (error) {
        }
    };
    // debt deletion
    const handleDeleteDebt = async (debtId, debtName) => {
        await deleteDebt(debtId, debtName, refreshData, authFetch);
    };
    // modal controllers: prepare forms and show/hide modals
    const openEditDebtModal = (debt) => {
        setSelectedDebtForEdit(debt);
        setEditDebtForm({
            name: debt.name,
            balance: debt.currentBalance.toString(),
            interestRate: debt.interestRate.toString(),
            minimumPayment: debt.minimumPayment.toString(),
            type: debt.type
        });
        setShowEditDebtForm(true);
    };
    
    const handleMakePayment = (debt = null) => {
        if (debt) {
            setSelectedDebtForPayment(debt);
        }
        setShowPaymentForm(true);
    };

    // Modal close handlers
    const closeAddDebtModal = () => {
        setShowAddDebtForm(false);
        resetForm(setNewDebtForm);
    };

    const closeEditDebtModal = () => {
        setShowEditDebtForm(false);
        setSelectedDebtForEdit(null);
        resetForm(setEditDebtForm);
    };

    const closePaymentModal = () => {
        setShowPaymentForm(false);
        setSelectedDebtForPayment(null);
        setPaymentAmount('');
    };

    useEffect(() => {
        refreshData();
    }, []);

    if (loading) {
        return <p>Loading debt data...</p>;
    }

    return (
        <div>
            <header><NavBar /></header>
            
            <div className="debt-container">
                <SideBar />
                
                <div className="debt-content">
                    {/* Overview Cards */}
                    <DebtOverview 
                        debtData={debtData}
                        debts={debts}
                        onAddDebt={() => setShowAddDebtForm(true)}
                        onMakePayment={() => handleMakePayment()}
                    />

                    {/* Debts Section */}
                    <div className="debts-section">
                        <h2>Your Debts</h2>
                        <DebtCards
                            debts={debts}
                            getDebtTypeIcon={getDebtTypeIcon}
                            getDebtTypeColor={getDebtTypeColor}
                            onMakePayment={handleMakePayment}
                            onEdit={openEditDebtModal}
                            onDelete={handleDeleteDebt}
                            onAddDebt={() => setShowAddDebtForm(true)}
                        />
                    </div>

                    {/* Add Debt Modal */}
                    <Modal
                        show={showAddDebtForm}
                        title="Add New Debt"
                        onClose={closeAddDebtModal}
                    >
                        <AddDebtForm
                            formData={newDebtForm}
                            setFormData={setNewDebtForm}
                            onSubmit={handleAddDebtSubmit}
                            onCancel={closeAddDebtModal}
                        />
                    </Modal>

                    {/* Edit Debt Modal */}
                    <Modal
                        show={showEditDebtForm && selectedDebtForEdit}
                        title="Edit Debt"
                        onClose={closeEditDebtModal}
                    >
                        <EditDebtForm
                            formData={editDebtForm}
                            setFormData={setEditDebtForm}
                            onSubmit={handleEditDebtSubmit}
                            onCancel={closeEditDebtModal}
                        />
                    </Modal>

                    {/* Payment Modal */}
                    <Modal
                        show={showPaymentForm}
                        title="Make a Payment"
                        onClose={closePaymentModal}
                    >
                        <PaymentForm
                            selectedDebt={selectedDebtForPayment}
                            paymentAmount={paymentAmount}
                            setPaymentAmount={setPaymentAmount}
                            onSubmit={handlePaymentSubmit}
                            onCancel={closePaymentModal}
                            debts={debts}
                            onDebtSelect={setSelectedDebtForPayment}
                            getDebtTypeIcon={getDebtTypeIcon}
                            getDebtTypeColor={getDebtTypeColor}
                        />
                    </Modal>
                </div>
            </div>
            
            <footer 
                className="footer-strip"
                style={{
                    padding: "6px 0",
                    width: "100vw",
                    marginLeft: "calc(50% - 50vw)",
                    marginRight: "calc(50% - 50vw)"
                }}
            >
                <Footer />
            </footer>
        </div>
    );
}