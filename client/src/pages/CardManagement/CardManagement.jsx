import { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import CsvExport from "../Budgeting/content/CsvExport";
import "./CardManagement.css";

const API = import.meta.env.VITE_API_URL;

async function safeFetchJson(url, { signal } = {}) {
  try {
    if (!API) {
      console.warn("VITE_API_URL is not set; skipping fetch:", url);
      return null;
    }
    const res = await fetch(url, { signal });
    if (!res.ok) {
      console.warn(`Request failed ${res.status} ${res.statusText}: ${url}`);
      return null;
    }
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) {
      console.warn(`Non-JSON response (content-type: ${ct}) from ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("safeFetchJson error:", err);
    return null;
  }
}

export default function CardManagement() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({
    nickname: "",
    type: "credit",
    brand: "",
    expMonth: "",
    expYear: "",
    limit: "",
    apr: "",
    balance: ""
  });

  // (legacy placeholders)
  const [account] = useState({
    checking: 1000,
    savings: 500,
    creditBalance: 2380,
    todaysCreditDebt: 100,
    schoolLoans: 12000
  });

  // Debts (kept for totals and overview)
  const [debts, setDebts] = useState([]);

  const fetchCards = async (signal) => {
    const data = await safeFetchJson(`${API}/cards`, { signal });
    setCards(Array.isArray(data) ? data : []);
  };

  const fetchDebts = async (signal) => {
    const data = await safeFetchJson(`${API}/debts`, { signal });
    setDebts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCards(ctrl.signal);
    fetchDebts(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({
          nickname: "",
          type: "credit",
          brand: "",
          expMonth: "",
          expYear: "",
          limit: "",
          apr: "",
          balance: ""
        });
        fetchCards();
      }
    } catch (err) {
      console.warn("create card failed:", err);
    }
  };

  const remove = async (id) => {
    try {
      await fetch(`${API}/cards/${id}`, { method: "DELETE" });
      fetchCards();
    } catch (err) {
      console.warn("delete card failed:", err);
    }
  };

  const removeDebt = async (id) => {
    try {
      await fetch(`${API}/debts/${id}`, { method: "DELETE" });
      fetchDebts();
    } catch (err) {
      console.warn("delete debt failed:", err);
    }
  };

  // ---- derived totals ----
  const fmt = (n) =>
    Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const debitTotal  = cards
    .filter(c => c.type === "debit")
    .reduce((sum, c) => sum + Number(c.balance || 0), 0);

  const creditTotal = cards
    .filter(c => c.type === "credit")
    .reduce((sum, c) => sum + Number(c.balance || 0), 0);

  const studentLoanTotal = debts
    .reduce((sum, d) => sum + Number((d.balance ?? d.currentBalance ?? 0)), 0);

  const combinedDebt = creditTotal + studentLoanTotal;
  // --------------------------------------------

  const BTN = { backgroundColor: "#A7E8BD", borderColor: "#A7E8BD", color: "#6B7280" };

  return (
    <div className="card-management-page pastel-bg" style={{ minWidth: "100vw" }}>
      {/* make header full-bleed across the viewport width */}
      <header
        className="top-bleed"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}
      >
        <NavBar />
      </header>

      {/* page helpers (kept existing overflow-x rule) + NEW card item box styling */}
      <style>{`
        /* remove horizontal scrollbar without changing layout */
        html, body, #root { overflow-x: hidden; }

        /* force the export button styling regardless of inner component markup */
        .csv-export-skin button,
        .csv-export-skin .btn,
        .csv-export-skin [type="button"] {
          background-color: #A7E8BD !important;
          border-color: #A7E8BD !important;
          color: #6B7280 !important;
        }
        /* hide any extra fields inside CsvExport - leave only the button(s) */
        .csv-export-skin input,
        .csv-export-skin select,
        .csv-export-skin label,
        .csv-export-skin .row,
        .csv-export-skin .filters,
        .csv-export-skin .search,
        .csv-export-skin .search-widget {
          display: none !important;
        }

        /* === Card Overview item boxes (thin border + subtle shadow) === */
        .cards-overview-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }
        .cards-overview-item {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 12px 14px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
        }
        .cards-overview-item .co-main { display: grid; gap: 6px; }
        .cards-overview-item .co-title {
          display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
        }
        .cards-overview-item .co-title strong { font-weight: 600; }
        .cards-overview-item .co-meta { color: #6B7280; font-size: 0.9em; text-transform: none; }
        .cards-overview-item .co-sub p { margin: 0; }
      `}</style>

      <div className="card-management-content" style={{ maxWidth: "none" }}>
        <SideBar />

        {/* Make right column stretch to the viewport's right edge (aligns with banner/footer) */}
        <div
          className="card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(520px, auto) 1fr",
            columnGap: 20,
            alignItems: "start",
            marginRight: "calc(50% - 50vw)",
            paddingRight: 16
          }}
        >
          {/* LEFT COLUMN */}
          <div className="left-stack" style={{ display: "grid", gap: 16 }}>
            {/* Enter Card */}
            <section className="card-panel">
              <h2>Enter Card Information</h2>

              <form className="card-form" onSubmit={submit}>
                <label>
                  Card Nickname
                  <input
                    value={form.nickname}
                    onChange={(e)=>setForm(f=>({...f, nickname:e.target.value}))}
                    placeholder="e.g., Capital One Platinum"
                    required
                  />
                </label>

                <div className="row">
                  <label>
                    Type
                    <select
                      value={form.type}
                      onChange={(e)=>setForm(f=>({...f, type:e.target.value}))}
                    >
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </label>

                  <label>
                    Brand
                    <input
                      value={form.brand}
                      onChange={(e)=>setForm(f=>({...f, brand:e.target.value}))}
                      placeholder="Visa / MasterCard"
                    />
                  </label>
                </div>

                <div className="row">
                  {/* optional number removed */}
                  <label>
                    Exp (MM/YY)
                    <div className="row compact">
                      <input
                        value={form.expMonth}
                        onChange={(e)=>setForm(f=>({...f, expMonth:e.target.value}))}
                        placeholder="MM"
                      />
                      <input
                        value={form.expYear}
                        onChange={(e)=>setForm(f=>({...f, expYear:e.target.value}))}
                        placeholder="YY"
                      />
                    </div>
                  </label>
                </div>

                {form.type === "credit" && (
                  <div className="row">
                    <label>
                      Limit
                      <input
                        type="number"
                        value={form.limit}
                        onChange={(e)=>setForm(f=>({...f, limit:e.target.value}))}
                        placeholder="0"
                      />
                    </label>
                    <label>
                      APR %
                      <input
                        type="number"
                        step="0.01"
                        value={form.apr}
                        onChange={(e)=>setForm(f=>({...f, apr:e.target.value}))}
                        placeholder="29"
                      />
                    </label>
                  </div>
                )}

                {form.type === "credit" ? (
                  <label>
                    Used Balance
                    <input
                      type="number"
                      step="0.01"
                      value={form.balance}
                      onChange={(e)=>setForm(f=>({...f, balance:e.target.value}))}
                      placeholder="0.00"
                    />
                  </label>
                ) : (
                  <label>
                    Account Balance
                    <input
                      type="number"
                      step="0.01"
                      value={form.balance}
                      onChange={(e)=>setForm(f=>({...f, balance:e.target.value}))}
                      placeholder="0.00"
                    />
                  </label>
                )}

                <button type="submit" className="primary" style={BTN}>Save Card</button>
              </form>
            </section>

            {/* Cards Overview */}
            <section className="card-panel cards-overview-panel">
              <h3>Cards</h3>
              <ul className="cards-overview-list">
                {cards.length === 0 && debts.length === 0 && (
                  <li className="cards-empty">No Cards Yet — add one.</li>
                )}

                {/* Cards */}
                {cards.map((c) => {
                  const isCredit = c.type === "credit";
                  const limit = Number(c.limit || 0);
                  const bal = Number(c.balance || 0);
                  const available = isCredit && limit > 0 ? Math.max(limit - bal, 0) : 0;
                  const pct = isCredit && limit > 0 ? Math.min(100, Math.max(0, (bal / limit) * 100)) : 0;

                  const typeLabel = (c.type || "").toLowerCase(); // show just the type as requested

                  return (
                    <li key={c._id} className="cards-overview-item">
                      <div className="co-main">
                        {/* Nickname + Type of card */}
                        <div className="co-title">
                          <strong>{c.nickname || "Card"}</strong>
                          <span className="co-meta">{typeLabel}</span>
                        </div>

                        {/* Balance / Available + Limit */}
                        <div className="co-sub">
                          {isCredit ? (
                            <>
                              <p>Available Balance: ${available.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                              {limit ? <p>Limit: ${limit.toLocaleString()}</p> : null}
                            </>
                          ) : (
                            <p>Balance: ${bal.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                          )}
                        </div>

                        {/* keep the utilization bar for credit if present */}
                        {isCredit && limit ? (
                          <div className="co-bar">
                            <div className="co-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        ) : null}
                      </div>

                      {/* Delete */}
                      <p>
                        <button type="button" className="link danger" onClick={()=>remove(c._id)}>
                          Delete
                        </button>
                      </p>
                    </li>
                  );
                })}

                {/* Loans list (no add form) */}
                {debts.map((d) => {
                  const loanBal = Number((d.balance ?? d.currentBalance ?? 0) || 0);
                  const loanType = (d.type || "loan").toLowerCase();
                  return (
                    <li key={`loan-${d._id}`} className="cards-overview-item">
                      <div className="co-main">
                        <div className="co-title">
                          <strong>{d.name || "Loan"}</strong>
                          <span className="co-meta">{loanType}</span>
                        </div>
                        <div className="co-sub">
                          <p>Balance: ${loanBal.toLocaleString()}</p>
                        </div>
                      </div>
                      <p>
                        <button type="button" className="link danger" onClick={()=>removeDebt(d._id)}>
                          Delete
                        </button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN — transparent container, cards separated by gap */}
          <section
            className="stats-panel"
            style={{
              display: "grid",
              gap: 16,
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0
            }}
          >
            <div className="stat-card">
              <h3>Account Balance</h3>
              <div>Total debit: ${fmt(debitTotal)}</div>
            </div>

            <div className="stat-card">
              <h3>Debt</h3>
              <div>Total Credit: <strong>${fmt(combinedDebt)}</strong></div>
            </div>

            {/* Combined Search + Export card */}
            <div className="stat-card">
              <h3>Search &amp; Export</h3>
              <TransactionSearch buttonStyle={BTN} />
              <div className="csv-export-skin" style={{ marginTop: 12 }}>
                <CsvExport />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Full-bleed, thin yellow band across viewport width */}
      <footer
        className="footer-strip"
        style={{
          padding: "6px 0",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}
      >
        <Footer />
      </footer>
    </div>
  );
}

/*search */
function TransactionSearch({ buttonStyle }) {
  const API = import.meta.env.VITE_API_URL;
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    try {
      const res = await fetch(`${API}/transactions?${params.toString()}`);
      if (!res.ok) { setResults([]); return; }
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      const data = ct.includes("application/json") ? await res.json() : [];
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
  };

  const clear = () => {
    setQ("");
    setFrom("");
    setTo("");
    setResults([]);
  };

  return (
    <div className="search-widget">
      {/* Search bar on top */}
      <div style={{ marginTop: 8 }}>
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search description…"
          style={{ width: "100%" }}
        />
      </div>

      {/* Dates + buttons below */}
      <div className="row" style={{ gap: 8, marginTop: 8 }}>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        <button type="button" onClick={search} style={buttonStyle}>Search</button>
        <button type="button" onClick={clear} style={buttonStyle}>Clear</button>
      </div>

      {results.length > 0 ? (
        <div className="search-results" style={{ marginTop: 12 }}>
          {results.slice(0, 8).map(tx => (
            <div key={tx._id} className="result-row">
              <span>${Number(tx.amount).toFixed(2)}</span>
              <span>{new Date(tx.date).toLocaleDateString()}</span>
              <span className="muted">{tx.description}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
