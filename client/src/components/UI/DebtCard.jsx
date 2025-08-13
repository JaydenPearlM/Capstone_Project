import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";

export default function DebtCard({ totalDebt = 0 }) {
    return (
        <Card>
            <CardContent className="debt">
                <h2>Total Debt Remaining</h2>
                <p className="amount">
                    ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </CardContent>
        </Card>
    )
}