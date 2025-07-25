import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";

export default function BudgetingCard() {
    return (
        <Card>
            <CardContent className="budget">
                <h2>Budget</h2>
                <p className="amount">$30.00 / $100</p>
                <div className="progress-bar used">
                    <div className="progress-fill" style={{ width: "30%" }}></div>
                </div>
            </CardContent>
        </Card>
    )
}