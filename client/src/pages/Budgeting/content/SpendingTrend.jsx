// src/components/budgeting/SpendingTrend.jsx
import React from "react";
import { Bar } from "react-chartjs-2";

export default function SpendingTrend({ transactions, dateRange, getDateRange, biweeklyStart, periodOffset }) {
  if (!dateRange) return null;

  const pad = (n) => n.toString().padStart(2, "0");

  // Helper to get month label & total
  const getMonthTotal = (offset) => {
    const range = getDateRange("monthly", biweeklyStart, periodOffset + offset);
    const startStr = `${range.start.getFullYear()}-${pad(range.start.getMonth() + 1)}-${pad(range.start.getDate())}`;
    const endStr = `${range.end.getFullYear()}-${pad(range.end.getMonth() + 1)}-${pad(range.end.getDate())}`;

    const total = transactions
      .filter((tx) => {
        const txDateStr = tx.date.slice(0, 10);
        return tx.type === "expense" && txDateStr >= startStr && txDateStr <= endStr;
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const monthLabel = range.start.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });

    return { label: monthLabel, total };
  };

  const last2 = getMonthTotal(-2);
  const last1 = getMonthTotal(-1);
  const current = getMonthTotal(0);

  const data = {
    labels: [last2.label, last1.label, current.label],
    datasets: [
      {
        label: "Total Spending ($)",
        data: [last2.total, last1.total, current.total],
        backgroundColor: ["#d0d0f5", "#8884d8", "#4a47a3"], // light → dark progression
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
        },
      },
    },
  };

  return (
    <div className="spending-compare">
      <h3>Spending Trend (Last 3 Months)</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
