import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";


export default function SavingsCard({ totalSavings = 0, goalProgress = 0 }) {
    return (
        <Card>
            <CardContent className="savings">
                <h2>Total Savings</h2>
                <p className="amount">
                    ${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="progress-bar goals">
                    <div className="progress-fill" style={{ width: `${goalProgress}%` }}></div>
                </div>
            </CardContent>
        </Card>
    )
}