import { Card, CardContent, Typography, Box, Divier } from "@mui/material";
import { Link} from 'react-router-dom';
import "./dashboardCards.css";

export default function AccountCard() {
    return (
        <Link to="/CardManagement">
            <Card>
                <CardContent className="accounts">
                    <h2>Account Balance</h2>
                    <p className="amount">
                        {/* Add actual checking amount here */}
                        Checking: $1000.00<br />
                        {/* Add actual savings amount here */}
                        Savings: $500.00
                    </p>

                </CardContent>
            </Card>
        </Link>
    )
}