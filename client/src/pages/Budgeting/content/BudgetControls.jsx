import React from "react";

export default function BudgetControls({
  budgetFrequency,
  setBudgetFrequency,
  biweeklyStart,
  setBiweeklyStart,
  setView,
  setPeriodOffset,
}) {
  return (
      <div className="budget-controls">
        <label>
          Budget Frequency:
          <select
            value={budgetFrequency}
            onChange={(e) => {
              setBudgetFrequency(e.target.value);
              setView(e.target.value);
              setPeriodOffset(0);
            }}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        {budgetFrequency === "biweekly" && (
          <label>
            Biweekly Start Date:
            <input
              type="date"
              value={biweeklyStart}
              onChange={(e) => {
                setBiweeklyStart(e.target.value);
                setPeriodOffset(0);
              }}
            />
          </label>
        )}
      </div>
  );
}