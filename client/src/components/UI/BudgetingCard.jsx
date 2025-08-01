<<<<<<< HEAD
import { Card, CardContent, Typography, Box, Divier } from "@mui/material";
import "./dashboardCards.css";

export default function BudgetingCard() {
=======
import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";

export default function BudgetingCard({ totalSpent = 0, totalBudget = 0 }) {
    const progressPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

>>>>>>> main
    return (
        <Card>
            <CardContent className="budget">
                <h2>Budget</h2>
<<<<<<< HEAD
                <p className="amount">$30.00 / $100</p>
                <div className="progress-bar used">
                    <div className="progress-fill" style={{ width: "30%" }}></div>
                </div>
            </CardContent>
        </Card>
    )
=======
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
>>>>>>> main
}