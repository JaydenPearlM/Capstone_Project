import { Card, CardContent, Typography, Box, Divier } from "@mui/material";
import "./dashboardCards.css";

export default function DebtCard() {
    return (
        <Card>
            <CardContent className="debt">
                <h2>Total Debt Remaining</h2>
                <p className="amount">
                    $42,000.01
                </p>
            </CardContent>
        </Card>
    )
}