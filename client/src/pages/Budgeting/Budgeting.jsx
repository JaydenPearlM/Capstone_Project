import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { Pie } from 'react-chartjs-2';
import { useState } from 'react';
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
    //Just using UseState for now, for design purposes
    const [categories, setCategories] = useState([
        { id: 1, name: 'Groceries', budget: 300 },
        { id: 2, name: 'Entertainment', budget: 150 },
        { id: 3, name: 'Utilities', budget: 200 },
        { id: 4, name: 'Travel', budget: 400 },
    ]);

    const [transactions, setTransactions] = useState([
        { id: 1, categoryId: 1, amount: 120, description: 'Walmart' },
        { id: 2, categoryId: 2, amount: 180, description: 'Movie night' },
        { id: 3, categoryId: 3, amount: 90, description: 'Electric bill' },
        { id: 4, categoryId: 1, amount: 210, description: 'Costco' },
    ])

    // Category from
    const [catForm, setCatForm] = useState({ id: null, name: '', budget: '' });
    const [catEditing, setCatEditing] = useState(false);

    // Transaction form
    const [txForm, setTxForm] = useState({ id: null, categoryId: '', amount: '', description: '' })
    const [txEditing, setTxEditing] = useState(false);

    const getCategorySpending = (categoryId) => {
        return transactions
            .filter((tx) => tx.categoryId === categoryId)
            .reduce((sum, tx) => sum + tx.amount, 0);
    };

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
                data: [
                    ...categories.map((cat) => getCategorySpending(cat.id)),
                    remaining,
                ],
                backgroundColor: [
                    ...categories.map((_, idx) => pastelColors[idx % pastelColors.length]),
                    '#D3D3D3', // Gray for remaining
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
                        />
                    </div>


                    
                </div>

            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}