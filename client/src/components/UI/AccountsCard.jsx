import { Card, CardContent } from "@mui/material";
import { Link } from 'react-router-dom';
import "./dashboardCards.css";

export default function AccountCard({ accountBalance = 0.00, savingsBalance = 0.00 }) {
    return (
        <Card>
            <CardContent className="accounts">
                <h2>Account Balance</h2>
                <p className="amount">
                    {/* Add actual checking amount here */}
                    Checking: ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}<br />
                    {/* shows savings balance with 2 decimal places */}
                    Savings: ${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </CardContent>
        </Card>
    )
}
