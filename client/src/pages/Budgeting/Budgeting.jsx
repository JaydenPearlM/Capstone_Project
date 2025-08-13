import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import { useState, useEffect, useMemo } from "react";
import "chart.js/auto";

import CategoryForm from "./forms/CategoryForm";
import TransactionForm from "./forms/TransactionForm";
import BudgetSummary from "./content/BudgetSummary";
import Categories from "./content/Categories";
import Transactions from "./content/Transactions";
import Modal from "./Modal";

import {
    handleCategorySubmit,
    deleteCategory,
    handleTransactionSubmit,
    deleteTransaction,
} from "./forms/handlers";

import "./Budgeting.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Budgeting() {
    const { authFetch } = useAuth();
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [catForm, setCatForm] = useState({ id: null, name: "", budget: "", budgetPeriod: "monthly", isRecurring: true });
    const [catEditing, setCatEditing] = useState(false);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [txForm, setTxForm] = useState({
        id: null,
        type: "expense",
        date: "",
        description: "",
        amount: "",
        categoryId: "",
    });
    const [txEditing, setTxEditing] = useState(false);

    const [budgetFrequency, setBudgetFrequency] = useState("monthly"); // weekly, biweekly, monthly
    const [biweeklyStart, setBiweeklyStart] = useState(""); // YYYY-MM-DD for biweekly start

    const [view, setView] = useState("monthly"); // Controls view mode for BudgetSummary & filtering

    // track an offset in periods (weeks, biweeks, months) relative to "today"
    // 0 means current period, -1 previous period, +1 next period, etc.
    const [periodOffset, setPeriodOffset] = useState(0);

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    useEffect(() => {
        // Reset offset when view or biweeklyStart changes
        setPeriodOffset(0);
    }, [view, biweeklyStart]);

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

    // Helper: Get date range based on view, biweeklyStart, and periodOffset
    const getDateRange = (view, biweeklyStart, offset) => {
        const today = new Date();
        let start, end;

        // "reference date" as today shifted by offset * period length
        const refDate = new Date(today);
        refDate.setHours(0, 0, 0, 0);

        if (view === "weekly") {
            // Move refDate by offset weeks
            refDate.setDate(refDate.getDate() + offset * 7);

            // Week starts on Sunday
            const day = refDate.getDay();
            start = new Date(refDate);
            start.setDate(refDate.getDate() - day);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (view === "biweekly") {
            if (!biweeklyStart) return null;

            const [year, month, day] = biweeklyStart.split("-").map(Number);
            // month is 0-based in Date constructor
            const startDate = new Date(year, month - 1, day);
            startDate.setHours(0, 0, 0, 0);

            // Anchor period 0 exactly at biweeklyStart date
            // Offset shifts periods by 14 days (2 weeks)
            start = new Date(startDate);
            start.setDate(startDate.getDate() + offset * 14);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setDate(start.getDate() + 13);
            end.setHours(23, 59, 59, 999);
        } else if (view === "monthly") {
            // Move refDate by offset months
            refDate.setMonth(refDate.getMonth() + offset);

            start = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
            start.setHours(0, 0, 0, 0);

            end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    };

    const dateRange = useMemo(() => getDateRange(view || budgetFrequency, biweeklyStart, periodOffset), [
        view,
        budgetFrequency,
        biweeklyStart,
        periodOffset,
    ]);

    // Filter transactions based on dateRange
    const filteredTransactions = useMemo(() => {
        if (!dateRange) return [];
        return transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate >= dateRange.start && txDate <= dateRange.end;
        });
    }, [transactions, dateRange]);

    // Filter categories WITHOUT recurring or createdAt filtering — include all
    const filteredCategories = useMemo(() => {
        if (!dateRange) return [];

        return categories;
    }, [categories, dateRange]);

    const adjustBudgetForView = (budget, catPeriod, currentView) => {
        const periodsInMonth = 4; // Approximate number of weeks or biweeks in a month
        if (catPeriod === currentView) {
            return budget;
        }
        if (catPeriod === "monthly") {
            if (currentView === "weekly") return budget / periodsInMonth;
            if (currentView === "biweekly") return budget / 2;
        }
        if (catPeriod === "biweekly") {
            if (currentView === "monthly") return budget * 2;
            if (currentView === "weekly") return budget / 2;
        }
        if (catPeriod === "weekly") {
            if (currentView === "monthly") return budget * periodsInMonth;
            if (currentView === "biweekly") return budget * 2;
        }
        // fallback: no adjustment
        return budget;
    };

    const noData = filteredCategories.length === 0 && filteredTransactions.length === 0;

    // Format date range nicely for display
    const formatDate = (date) => {
        if (!(date instanceof Date)) return "";
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    };

    // Handlers for Previous / Next period
    const handlePrevPeriod = () => {
        setPeriodOffset((prev) => prev - 1);
    };

    const handleNextPeriod = () => {
        setPeriodOffset((prev) => prev + 1);
    };

    return (
        <div>
            <header>
                <NavBar />
            </header>

            <div className="budget-container">
                <SideBar />

                <div className="budget-content">
                    {/* Getting Started Section */}
                    {noData && (
                        <div className="getting-started">
                            <h2>Getting Started with Budgeting</h2>
                            <p>It looks like you haven’t set up your budget yet! Here’s how to begin:</p>
                            <ol>
                                <li>Create your first budget category (e.g., Rent, Groceries, Savings).</li>
                                <li>Set a monthly budget amount for each category.</li>
                                <li>Add your transactions to track spending.</li>
                                <li>Watch the pie chart update in real-time!</li>
                            </ol>
                        </div>
                    )}

                    <div className="budget-control-container">
                        {/* Period navigation */}
                        <div className="period-navigation">
                            <button onClick={handlePrevPeriod}>&lt; Previous</button>
                            <span className="date-range-display">
                                Viewing {view.charAt(0).toUpperCase() + view.slice(1)} Budget:{" "}
                                {dateRange ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}` : "N/A"}
                            </span>
                            <button onClick={handleNextPeriod}>Next &gt;</button>
                        </div>
            
                        <p className="frequency-p">
                            Choose the frequency you'd like to view your budget. 
                        </p>
                        {/* Budget Controls */}
                        <div className="budget-controls">
                            <label>
                                Budget Frequency:
                                <select
                                    value={budgetFrequency}
                                    onChange={(e) => {
                                        setBudgetFrequency(e.target.value);
                                        setView(e.target.value);
                                        setPeriodOffset(0);
                                    }}
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Biweekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </label>

                            {budgetFrequency === "biweekly" && (
                                <label>
                                    Biweekly Start Date:
                                    <input
                                        type="date"
                                        value={biweeklyStart}
                                        onChange={(e) => {
                                            setBiweeklyStart(e.target.value);
                                            setPeriodOffset(0);
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="budgeting-summary-container">
                        <h2>Budget Summary</h2>
                        <BudgetSummary
                            categories={filteredCategories.map(cat => ({
                                ...cat,
                                // Adjust budget according to view and category budgetPeriod
                                budget: adjustBudgetForView(cat.budget, cat.budgetPeriod || "monthly", view),
                            }))}
                            transactions={filteredTransactions}
                            view={view}
                            dateRange={dateRange}  // <-- pass it here for display
                            setView={(newView) => {
                                setView(newView);
                                setBudgetFrequency(newView);
                                setPeriodOffset(0);
                            }}
                        />
                    </div>

                    <div className="transactions-container">
                        <Transactions
                            transactions={filteredTransactions}
                            categories={filteredCategories}
                            setTxForm={(form) => {
                                setTxForm(form);
                            }}
                            setTxEditing={setTxEditing}
                            deleteTransaction={(id) => deleteTransaction(id, setTransactions, authFetch)}
                            dateRange={dateRange}
                            view={view}
                        />
                        <button
                            className="add-btn"
                            onClick={() => {
                                setTxForm({ id: null, categoryId: "", amount: "", description: "", type: "expense", date: "" });
                                setTxEditing(false);
                                setShowTransactionModal(true);
                            }}
                        >
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
                                    handleTransactionSubmit(e, txForm, txEditing, transactions, setTransactions, setTxForm, setTxEditing, authFetch, categories);
                                    setShowTransactionModal(false);
                                }}
                            />
                        </Modal>
                    </div>

                    <div className="categories-container">
                        <Categories
                            categories={filteredCategories}
                            transactions={transactions}
                            setCatForm={(form) => {
                                setCatForm(form);
                            }}
                            setCatEditing={setCatEditing}
                            deleteCategory={(id) => deleteCategory(id, setCategories, setTransactions, authFetch)}
                            dateRange={dateRange}
                        />

                        <button
                            className="add-btn"
                            onClick={() => {
                                setCatForm({ id: null, name: "", budget: "", budgetPeriod: "monthly", isRecurring: true });
                                setCatEditing(false);
                                setShowCategoryModal(true);
                            }}
                        >
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
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}
