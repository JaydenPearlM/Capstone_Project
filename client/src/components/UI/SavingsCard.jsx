import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import "./dashboardCards.css";

export default function SavingsCard() {
    return (
        <Card>
            <CardContent className="savings">
                <h2>Total Savings</h2>
                <p className="amount">
                    $2,000.00
                </p>
                <div className="progress-bar goals">
                    <div className="progress-fill" style={{ width: "80%" }}></div>
                </div>

            </CardContent>
        </Card>
    )
}