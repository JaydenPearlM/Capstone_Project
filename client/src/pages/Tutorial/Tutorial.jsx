// src/pages/Tutorial/Tutorial.jsx
import React, { useEffect } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import "./Tutorial.css";

const sections = [
  { id: "dashboard", label: "Dashboard" },
  { id: "budgeting", label: "Budgeting" },
  { id: "card-management", label: "Card Management" },
  { id: "debt", label: "Debt" },
  { id: "savings", label: "Savings" },
  { id: "settings", label: "Settings" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export default function Tutorial() {
  // Smooth in-page anchor scrolling (doesn't affect router)
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", a.getAttribute("href"));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="tutorial-page">
      {/* Top navigation (your logo + links) */}
      <header>
      <NavBar />
      </header>      

      <div className="tutorial-shell">
        {/* Left app sidebar (your existing component) */}
        <SideBar />

        {/* Right content */}
        <main className="tutorial-main" id="top">
          <header className="tutorial-header">
            <h1>In-App Tutorial</h1>
            <p className="subtitle">
              Learn what you can do in each section of <strong>Cache Budgeting</strong>.
            </p>
          </header>

          {/* Quick Facts for registered users */}
          <section className="facts card">
            <h2>Quick Facts</h2>
            <ul>
              <li><strong>Dashboard:</strong> Snapshot of budgets, debt, savings, and cards.</li>
              <li><strong>Budgeting:</strong> Categories, transactions, period navigation, summaries.</li>
              <li><strong>Card Management:</strong> Credit/debit cards, limits, APR, balances, CSV export.</li>
              <li><strong>Debt:</strong> Add debts, record payments, totals & payoff projection.</li>
              <li><strong>Savings:</strong> Goals, contributions, per-goal progress + totals.</li>
              <li><strong>Settings:</strong> Profile and password management.</li>
            </ul>
          </section>

          {/* Table of Contents (after Quick Facts) */}
          <section className="toc card">
            <h3>Table of Contents</h3>
            <nav>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          {/* DASHBOARD */}
          <section id="dashboard" className="tutorial-section card">
            <h2>Dashboard</h2>
            <p className="lead">See totals for Budget, Debt, Savings, and Accounts at a glance.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li>Add categories & transactions in <a href="#budgeting">Budgeting</a>.</li>
              <li>Add your cards in <a href="#card-management">Card Management</a>.</li>
              <li>Add debts and record payments in <a href="#debt">Debt</a>.</li>
              <li>Create savings goals & contributions in <a href="#savings">Savings</a>.</li>
              <li>Return here to verify totals and trends.</li>
            </ol>
          </section>

          {/* BUDGETING */}
          <section id="budgeting" className="tutorial-section card">
            <h2>Budgeting</h2>
            <p className="lead">Create categories, add transactions, and analyze spend by period.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li><strong>Create Categories:</strong> Add name (e.g., Groceries), budget amount, period (Monthly/Weekly/Bi-Weekly), recurring if needed → <em>Save</em>.</li>
              <li><strong>Add Transactions:</strong> Type (Expense/Income), date, description, amount, category → <em>Save</em>.</li>
              <li><strong>Navigate Periods:</strong> Switch Monthly/Bi-Weekly/Weekly; use Next/Prev; tables & charts follow the selected range.</li>
              <li><strong>Review:</strong> Check Budget Summary, Spending Trend, and Recent Transactions.</li>
            </ol>

            <div className="callouts">
              <div className="good"><strong>Good:</strong> Create categories first so expenses are categorized immediately.</div>
              <div className="risky"><strong>Risky:</strong> Deleting categories that still have transactions you need.</div>
            </div>
          </section>

          {/* CARD MANAGEMENT */}
          <section id="card-management" className="tutorial-section card">
            <h2>Card Management</h2>
            <p className="lead">Track credit/debit cards, balances, limits, APR, and export filtered CSVs.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li><strong>Add a Card:</strong> Nickname, Type (credit/debit), Brand (optional), Expiration (optional).</li>
              <li><strong>For Credit:</strong> Set <em>Limit</em>, <em>APR</em>, and current <em>Balance</em> (used balance).</li>
              <li><strong>Save & Edit:</strong> <em>Save</em>. Use <em>Edit</em> later to update balances or details.</li>
              <li><strong>Utilization:</strong> For credit, the bar appears when a limit is set (<code>available = limit − used</code>).</li>
              <li><strong>Search & Export:</strong> Apply date/keyword filters, then click <em>Export CSV</em> to download the results.</li>
            </ol>
          </section>

          {/* DEBT */}
          <section id="debt" className="tutorial-section card">
            <h2>Debt</h2>
            <p className="lead">Add debts/loans, record payments, and monitor totals & payoff projection.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li><strong>Add Debt:</strong> Name, Type (credit/loan/other), Current Balance, Interest %, Minimum Payment → <em>Save</em>.</li>
              <li><strong>Edit Debt:</strong> Use <em>Edit</em> to update details as they change.</li>
              <li><strong>Record Payment:</strong> <em>Make Payment</em> → Amount → <em>Save</em> (updates balance & projections).</li>
              <li><strong>Overview:</strong> Review Total Debt, Monthly Payments, Avg Interest Rate, and estimated Debt-Free Date.</li>
            </ol>
          </section>

          {/* SAVINGS */}
          <section id="savings" className="tutorial-section card">
            <h2>Savings</h2>
            <p className="lead">Create goals, contribute, and track progress across all targets.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li><strong>Create Goal:</strong> Title, Goal Amount, Target Date → <em>Save</em>.</li>
              <li><strong>Contribute:</strong> <em>Contribute</em> → Amount → <em>Save</em>.</li>
              <li><strong>Edit:</strong> Update Title/Amount/Target Date as plans change.</li>
              <li><strong>Progress:</strong> Check per-goal progress bars and overall totals.</li>
            </ol>
          </section>

          {/* SETTINGS */}
          <section id="settings" className="tutorial-section card">
            <h2>Settings</h2>
            <p className="lead">Manage your profile details and change your password.</p>

            <h3>Step-by-Step</h3>
            <ol>
              <li>Open <em>Profile</em> to view (or edit if enabled).</li>
              <li>Open <em>Change Password</em> → enter current & new password → <em>Save</em>.</li>
            </ol>
          </section>

          {/* TROUBLESHOOTING */}
          <section id="troubleshooting" className="tutorial-section card">
            <h2>Troubleshooting</h2>
            <ul className="checklist">
              <li><strong>Dashboard shows zeros:</strong> Ensure pages have data and the API is running.</li>
              <li><strong>Auth errors:</strong> Confirm you’re logged in and requests use <code>authFetch</code>.</li>
              <li><strong>CSV empty:</strong> Apply search filters in Card Management before exporting.</li>
            </ul>
            <a className="top-link" href="#top">Back to top ↑</a>
          </section>
        </main>
      </div>
    </div>
  );
}
