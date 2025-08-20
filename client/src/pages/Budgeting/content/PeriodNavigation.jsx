import React from "react";

export default function PeriodNavigation({ view, dateRange, onPrev, onNext }) {
  const formatDate = (date) => {
    if (!(date instanceof Date)) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="period-navigation">
      <button onClick={onPrev}>&lt; Previous</button>
      <span className="date-range-display">
        Viewing {view.charAt(0).toUpperCase() + view.slice(1)} Budget:<br></br>{" "}
        {dateRange ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}` : "N/A"}
      </span>
      <button onClick={onNext}>Next &gt;</button>
    </div>
  );
}