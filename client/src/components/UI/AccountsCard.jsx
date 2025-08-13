import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import "./dashboardCards.css";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

<<<<<<< HEAD
export default function AccountCard({ savingsBalance = 500.00 }){
    return (
        // <Link to="/CardManagement">
            <Card>
                <CardContent className="accounts">
                    <h2>Account Balance</h2>
                    <p className="amount">
                        {/* Add actual checking amount here */}
                        Checking: $1000.00<br />
                        {/* shows savings balance with 2 decimal places */}
                        Savings: ${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>

                </CardContent>
            </Card>
            
        // </Link>
    )
}
=======
export default function AccountCard() {
  const [checking, setChecking] = useState(0);
  const [savings, setSavings] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`${API}/cards`);
        if (!res.ok) throw new Error("Failed to fetch cards");
        const cards = await res.json();

        const checkingTotal = cards
          .filter((c) => c.type === "debit" && c.accountCategory === "checking")
          .reduce((sum, c) => sum + Number(c.balance || 0), 0);

        const savingsTotal = cards
          .filter((c) => c.type === "debit" && c.accountCategory === "savings")
          .reduce((sum, c) => sum + Number(c.balance || 0), 0);

        setChecking(checkingTotal);
        setSavings(savingsTotal);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchCards();
  }, []);

  return (
    <Link to="/dashboard/cardManagement">
      <Card>
        <CardContent className="accounts">
          <h2>Account Balance</h2>
          {error ? (
            <p className="amount">Error: {error}</p>
          ) : (
            <p className="amount">
              Checking: ${checking.toFixed(2)}
              <br />
              Savings: ${savings.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
>>>>>>> bfe520b9001345e53c4930e2a178963ff6a5ec8d
