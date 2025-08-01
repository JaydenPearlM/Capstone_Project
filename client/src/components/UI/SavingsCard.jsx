<<<<<<< HEAD
import { Card, CardContent, Typography, Box, Divier } from "@mui/material";
=======
import { Card, CardContent } from "@mui/material";
>>>>>>> main
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
<<<<<<< HEAD

=======
>>>>>>> main
            </CardContent>
        </Card>
    )
}