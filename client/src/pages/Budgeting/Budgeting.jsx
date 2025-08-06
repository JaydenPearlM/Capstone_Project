import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import 'chart.js/auto';

import CategoryForm from "./forms/CategoryForm";
import TransactionForm from "./forms/TransactionForm";
import BudgetSummary from "./content/BudgetSummary";
import Categories from './content/Categories';
import Transactions from './content/Transactions';

import {
    handleCategorySubmit,
    deleteCategory,
    handleTransactionSubmit,
    deleteTransaction,
} from './forms/handlers';

import './Budgeting.css';

export default function Budgeting() {
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [catForm, setCatForm] = useState({ id: null, name: '', budget: '' });
    const [catEditing, setCatEditing] = useState(false);

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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err.message);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err.message);
        }
    };

    const getCategorySpending = (categoryId) =>
        transactions
            .filter((tx) => tx.categoryId === categoryId)
            .reduce((sum, tx) => sum + tx.amount, 0);

    const totalBudget = categories.reduce((sum, cat) => sum + Number(cat.budget), 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const remaining = Math.max(totalBudget - totalSpent, 0);

    const pastelColors = [
        '#A8DADC', '#FFDDD2', '#FFD6E0', '#E0BBE4', '#B5EAD7',
        '#C7CEEA', '#FCD5CE', '#D8E2DC', '#E2F0CB', '#B5D2CB',
    ];

    const pieData = {
        labels: [...categories.map((cat) => cat.name), 'Remaining Budget'],
        datasets: [
            {
                data: [...categories.map((cat) => getCategorySpending(cat._id)), remaining],
                backgroundColor: [
                    ...categories.map((_, idx) => pastelColors[idx % pastelColors.length]),
                    '#D3D3D3',
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div>
            <header>
                <NavBar />
            </header>

            <div className="budget-container">
                <SideBar />

                <div className="budget-content">

                    <div className="budgeting-summary-container">
                        <h2>Budget Summary</h2>
                        <div className="pieChart">
                            <Pie data={pieData} />
                        </div>
                        <BudgetSummary categories={categories} transactions={transactions} />
                    </div>

                    <div className="transactions-container">
                        <Transactions
                            transactions={transactions}
                            categories={categories}
                            setTxForm={setTxForm}
                            setTxEditing={setTxEditing}
                            deleteTransaction={(id) => deleteTransaction(id, setTransactions)}
                        />

                        <TransactionForm
                            txForm={txForm}
                            setTxForm={setTxForm}
                            txEditing={txEditing}
                            setTxEditing={setTxEditing}
                            categories={categories}
                            transactions={transactions}
                            setTransactions={setTransactions}
                            handleSubmit={handleTransactionSubmit}
                            className="transaction-form"
                        />
                    </div>

                    <div className="categories-container">
                        <Categories
                            categories={categories}
                            transactions={transactions}
                            setCatForm={setCatForm}
                            setCatEditing={setCatEditing}
                            deleteCategory={(id) => deleteCategory(id, setCategories, setTransactions)}
                        />

                        <CategoryForm
                            catForm={catForm}
                            setCatForm={setCatForm}
                            catEditing={catEditing}
                            setCatEditing={setCatEditing}
                            categories={categories}
                            setCategories={setCategories}
                            handleSubmit={handleCategorySubmit}
                            className="category-form"
                        />
                    </div>
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}
