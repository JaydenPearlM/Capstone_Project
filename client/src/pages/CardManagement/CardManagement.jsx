import { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/layout/Footer";
import CsvExport from "../../components/common/CsvExport";
import { useAuth } from "../../contexts/AuthContext"; // <— key: adds token to requests
import { fetchDebtData } from "../Debt/forms/handlers"; // from debt
import "./CardManagement.css";

const API = import.meta.env.VITE_API_URL;

export default function CardManagement() {
  const { authFetch } = useAuth(); // <— use the authenticated fetch
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
  const [editingId, setEditingId] = useState(null); // <-- edit mode

  // Debts (kept for totals and overview)
  const [debtData, setDebtData] = useState({totalDebt:0});
  const [debts, setDebts] = useState([]);
  
  const refreshDebts = () => {
  fetchDebtData(setDebtData, setDebts, () => {}, authFetch);
  };

  const fetchCards = async (signal) => {
    if (!API) return setCards([]);
    try {
      const res = await authFetch(`${API}/cards`, { signal });
      const data = res?.ok ? await res.json() : [];
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("fetchCards failed:", err);
      setCards([]);
    }
  };

  const fetchDebts = async (signal) => {
    if (!API) return setDebts([]);
    try {
      const res = await authFetch(`${API}/debts`, { signal });
      const data = res?.ok ? await res.json() : [];
      setDebts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("fetchDebts failed:", err);
      setDebts([]);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCards(ctrl.signal);
    // fetchDebts(ctrl.signal);
    refreshDebts();
    return () => ctrl.abort();
  }, []);

  // ---------- Edit handling ----------
  const handleEdit = (card) => {
    setForm({
      nickname: card.nickname || "",
      type: card.type || "credit",
      brand: card.brand || "",
      expMonth: card.expMonth || "",
      expYear: card.expYear || "",
      limit: card.limit ?? "",
      apr: card.apr ?? "",
      balance: card.balance ?? ""
    });
    setEditingId(card._id);
    document.getElementById("card-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
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
  };
  // -----------------------------------

  const submit = async (e) => {
    e.preventDefault();
    if (!API) return;

    // Coerce numeric fields to numbers (or null) so backend stays consistent
    const payload = {
      nickname: form.nickname.trim(),
      type: form.type,
      brand: form.brand.trim(),
      expMonth: form.expMonth,
      expYear: form.expYear,
      limit: form.type === "credit"
        ? (form.limit === "" ? null : Number(form.limit))
        : null,
      apr: form.type === "credit"
        ? (form.apr === "" ? null : Number(form.apr))
        : null,
      balance: form.balance === "" ? 0 : Number(form.balance),
    };

    try {
      const url = editingId ? `${API}/cards/${editingId}` : `${API}/cards`;
      const method = editingId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setCards(prev => prev.map(c => (c._id === editingId ? saved : c)));
        } else {
          setCards(prev => [saved, ...prev]);
        }
        cancelEdit(); // reset form + exit edit mode
      } else {
        const err = await res.json().catch(() => ({}));
        console.warn(`${editingId ? "update" : "create"} card failed:`, err?.error || res.statusText);
      }
    } catch (err) {
      console.warn(`${editingId ? "update" : "create"} card failed:`, err);
    }
  };

  const remove = async (id) => {
    if (!API) return;
    try {
      await authFetch(`${API}/cards/${id}`, { method: "DELETE" });
      setCards(prev => prev.filter(c => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      console.warn("delete card failed:", err);
    }
  };

  const removeDebt = async (id) => {
    if (!API) return;
    try {
      await authFetch(`${API}/debts/${id}`, { method: "DELETE" });
      setDebts(prev => prev.filter(d => d._id !== id));
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

  // const combinedDebt = creditTotal + studentLoanTotal; 

  const combinedDebt = creditTotal + (debtData.totalDebt || 0);
  // --------------------------------------------

  const BTN = { backgroundColor: "#A7E8BD", borderColor: "#A7E8BD", color: "#6B7280" };

  return (
    <div className="card-management-page">
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

      <div className="card-management-content" style={{ maxWidth: "none" }}>
        <SideBar />

        {/* Make right column stretch to the viewport's right edge (aligns with banner/footer) */}
        <div className="card-grid">
          {/* LEFT COLUMN */}
          <div className="left-stack" style={{ display: "grid", gap: 16 }}>
            {/* Enter Card */}
            <section className="card-panel">
              <h2>{editingId ? "Edit Card" : "Enter Card Information"}</h2>

              <form id="card-form" className="card-form" onSubmit={submit}>
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

                <div style={{ display: "flex", gap: 8 }}>
                  {/* keep your submit button exactly as before */}
                  <button type="submit" className="primary" style={BTN}>
                    Save Card
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="card-cancel-btn"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
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

                  const typeLabel = (c.type || "").toLowerCase();

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

                        {/* utilization bar for credit */}
                        {isCredit && limit ? (
                          <div className="co-bar">
                            <div className="co-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        ) : null}
                      </div>

                      {/* Actions — keep your classes exactly */}
                      <p>
                        <button
                          type="button"
                          className="card-edit-btn"
                          data-role="edit-card"
                          data-id={c._id}
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="card-del-btn"
                          onClick={()=>remove(c._id)}
                        >
                          Delete
                        </button>
                      </p>
                    </li>
                  );
                })}

                {/* Loans list (no add form) */}
                {debts
                  .filter(d => d.type === "credit_card") // testing this line for credit card only
                  .map((d) => {
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
            <div className="account-bal-card">
              <h3>Account Balance</h3>
              <div>Total debit: ${fmt(debitTotal)}</div>
            </div>

            <div className="debt-card">
              <h3>Debt</h3>
              <div>Total Credit: <strong>${fmt(combinedDebt)}</strong></div>
            </div>

            {/* Combined Search + Export card */}
            <div className="csv-card">
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
  const { authFetch } = useAuth(); // use JWT on requests

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [names, setNames] = useState([]);      // <-- names only
  const [loading, setLoading] = useState(false);

  const buildParams = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params;
  };

  const search = async () => {
    if (!API) return setNames([]);
    try {
      setLoading(true);
      const res = await authFetch(`${API}/transactions?${buildParams().toString()}`);
      if (!res.ok) {
        setNames([]);
        return;
      }
      const data = await res.json();

      // unique list of descriptions (names), trimmed, non-empty
      const uniq = Array.isArray(data)
        ? Array.from(new Set(data.map(tx => (tx.description || "").trim()).filter(Boolean)))
        : [];

      setNames(uniq);
    } catch {
      setNames([]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setQ("");
    setFrom("");
    setTo("");
    setNames([]);
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

      {/* Dates + buttons */}
      <div className="row" style={{ gap: 8, marginTop: 8 }}>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        <button type="button" onClick={search} style={buttonStyle}>Search</button>
        <button type="button" onClick={clear}  style={buttonStyle}>Clear</button>
      </div>

      {/* 👇 Names output moved HERE, under the buttons 👇 */}
      <div style={{ marginTop: 12 }}>
        {loading && <div className="muted" style={{ fontSize: 12 }}>Loading…</div>}

        {!loading && names.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            {names.map(name => (
              <div
                key={name}
                style={{
                  background: "#A7E8BD",        // mint green
                  color: "#374151",
                  padding: "10px 12px",
                  borderRadius: 12
                }}
                title={name}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        {!loading && names.length === 0 && (
          <div className="muted" style={{ fontSize: 12 }}>No names for current filters.</div>
        )}
      </div>
    </div>
  );
}
