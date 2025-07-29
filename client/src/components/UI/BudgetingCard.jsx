import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";

export default function BudgetingCard({ totalSpent = 0, totalBudget = 0 }) {
    const progressPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <Card>
            <CardContent className="budget">
                <h2>Budget</h2>
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