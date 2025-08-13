import { Card, CardContent } from "@mui/material";
import "./dashboardCards.css";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function DebtCard() {
  const [totalDebt, setTotalDebt] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDebts() {
      try {
        const res = await fetch(`${API}/debts`);
        if (!res.ok) throw new Error("Failed to fetch debts");
        const data = await res.json();
        const sum = data.reduce(
          (acc, d) => acc + Number(d.currentBalance || 0),
          0
        );
        setTotalDebt(sum);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchDebts();
  }, []);

  return (
    <Card>
      <CardContent className="debt">
        <h2>Total Debt Remaining</h2>
        {error ? (
          <p className="amount">Error: {error}</p>
        ) : (
          <p className="amount">
            $
            {totalDebt.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
