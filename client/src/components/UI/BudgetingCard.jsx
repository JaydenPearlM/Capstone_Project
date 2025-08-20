import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function BudgetingCard() {
    const { authFetch } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        async function fetchData() {
            try {
                const [txRes, catRes] = await Promise.all([
                    authFetch(`${import.meta.env.VITE_API_URL}/transactions`),
                    authFetch(`${import.meta.env.VITE_API_URL}/categories`)
                ]);

                if (!txRes.ok || !catRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const txData = await txRes.json();
                const catData = await catRes.json();

                setTransactions(txData);
                setCategories(catData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [authFetch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error}</p>;

    // Compute current month period
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date) =>
        date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

    const period = `${formatDate(startOfMonth)} – ${formatDate(endOfMonth)}`;

    // Filter transactions for the current month
    const pad = (n) => n.toString().padStart(2, "0");
    const startStr = `${startOfMonth.getFullYear()}-${pad(startOfMonth.getMonth() + 1)}-${pad(startOfMonth.getDate())}`;
    const endStr = `${endOfMonth.getFullYear()}-${pad(endOfMonth.getMonth() + 1)}-${pad(endOfMonth.getDate())}`;

    const currentMonthTx = transactions.filter(tx => {
        const txDate = tx.date.slice(0, 10); // YYYY-MM-DD
        return txDate >= startStr && txDate <= endStr;
    });

    // Compute totals
    const totalSpent = currentMonthTx.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalBudget = categories.reduce((sum, cat) => sum + Number(cat.budget), 0);

    const progressPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <Card>
            <CardContent className="budget">
                <h2>Budget</h2>
                <p className="period">{period}</p>
                <p className="amount">${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</p>
                <div className="progress-bar used">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </CardContent>
        </Card>
    );
}
