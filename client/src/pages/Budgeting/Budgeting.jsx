import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { useState, useEffect } from 'react';
import 'chart.js/auto';


import CategoryForm from "./forms/CategoryForm";
import TransactionForm from "./forms/TransactionForm";
import BudgetSummary from "./content/BudgetSummary";
import Categories from './content/Categories';
import Transactions from './content/Transactions';
import Modal from "./Modal";


import {
    handleCategorySubmit,
    deleteCategory,
    handleTransactionSubmit,
    deleteTransaction,
} from './forms/handlers';

import './Budgeting.css';
import { useAuth } from "../../contexts/AuthContext";

export default function Budgeting() {
    const { authFetch } = useAuth();
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [catForm, setCatForm] = useState({ id: null, name: '', budget: '' });
    const [catEditing, setCatEditing] = useState(false);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [txForm, setTxForm] = useState({
        id: null,
        type: 'expense',
        date: '',
        description: '',
        amount: '',
        categoryId: ''
    });
    const [txEditing, setTxEditing] = useState(false);


    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await authFetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err.message);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await authFetch(`${import.meta.env.VITE_API_URL}/transactions`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err.message);
        }
    };

    const noData = categories.length === 0 && transactions.length === 0;

    return (
        <div>
            <header>
                <NavBar />
            </header>

            <div className="budget-container">
                <SideBar />

                <div className="budget-content">

                    {/* Show a getting started section if there is no data */}
                    {noData && (
                        <div className="getting-started">
                            <h2>Getting Started with Budgeting</h2>
                            <p>
                                It looks like you haven’t set up your budget yet!
                                Here’s how to begin:
                            </p>
                            <ol>
                                <li>Create your first budget category (e.g., Rent, Groceries, Savings).</li>
                                <li>Set a monthly budget amount for each category.</li>
                                <li>Add your transactions to track spending.</li>
                                <li>Watch the pie chart update in real-time!</li>
                            </ol>
                        </div>
                    )}

                    <div className="budgeting-summary-container">
                        <h2>Budget Summary</h2>
                        <BudgetSummary categories={categories} transactions={transactions} />
                    </div>

                    <div className="categories-container">
                        <Categories
                            categories={categories}
                            transactions={transactions}
                            setCatForm={(form) => { setCatForm(form); }}
                            setCatEditing={setCatEditing}
                            deleteCategory={(id) => deleteCategory(id, setCategories, setTransactions, authFetch)}
                        />

                        <button className="add-btn" onClick={() => {
                            setCatForm({ id: null, name: '', budget: '' });
                            setCatEditing(false);
                            setShowCategoryModal(true);
                        }}>
                            + Add Category
                        </button>
                        {/* Category Modal */}
                        <Modal
                            show={showCategoryModal || catEditing}
                            onClose={() => setShowCategoryModal(false)}
                            title={catEditing ? "Edit Category" : "Add Category"}
                        >
                            <CategoryForm
                                catForm={catForm}
                                setCatForm={setCatForm}
                                catEditing={catEditing}
                                setCatEditing={setCatEditing}
                                categories={categories}
                                setCategories={setCategories}
                                handleSubmit={(e, catForm, catEditing, categories, setCategories, setCatForm, setCatEditing) => {
                                    handleCategorySubmit(e, catForm, catEditing, categories, setCategories, setCatForm, setCatEditing, authFetch);
                                    setShowCategoryModal(false);
                                }}
                            />
                        </Modal>
                    </div>

                    <div className="transactions-container">
                        <Transactions
                            transactions={transactions}
                            categories={categories}
                            setTxForm={(form) => { setTxForm(form); }}
                            setTxEditing={setTxEditing}
                            deleteTransaction={(id) => deleteTransaction(id, setTransactions, authFetch)}
                        />
                        <button className="add-btn" onClick={() => {
                            setTxForm({ id: null, categoryId: '', amount: '', description: '', type: 'expense', date: '' });
                            setTxEditing(false);
                            setShowTransactionModal(true);
                        }}>
                            + Add Transaction
                        </button>
                        {/* Transaction Modal */}
                        <Modal
                            show={showTransactionModal || txEditing}
                            onClose={() => setShowTransactionModal(false)}
                            title={txEditing ? "Edit Transaction" : "Add Transaction"}
                        >
                            <TransactionForm
                                txForm={txForm}
                                setTxForm={setTxForm}
                                txEditing={txEditing}
                                setTxEditing={setTxEditing}
                                categories={categories}
                                transactions={transactions}
                                setTransactions={setTransactions}
                                handleSubmit={(e, txForm, txEditing, transactions, setTransactions, setTxForm, setTxEditing) => {
                                    handleTransactionSubmit(e, txForm, txEditing, transactions, setTransactions, setTxForm, setTxEditing, authFetch);
                                    setShowTransactionModal(false);
                                }}
                            />
                        </Modal>
                    </div>
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}