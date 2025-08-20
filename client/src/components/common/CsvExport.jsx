import { useState, useMemo } from "react";

const API = import.meta.env.VITE_API_URL;

export default function CsvExport() {
  // fields the backend supports; toggle which ones you want to export
  const [selected, setSelected] = useState(["date", "description", "amount"]);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState(false);

  const allFields = useMemo(
    () => ["date", "description", "amount", "category", "type"],
    []
  );

  const toggle = (field) => {
    setSelected((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const doExport = async () => {
    try {
      setDownloading(true);
      const params = new URLSearchParams();
      if (selected.length) params.set("fields", selected.join(","));
      if (q) params.set("q", q);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`${API}/reports/csv?${params.toString()}`);
      if (!res.ok) {
        console.error("CSV export failed", await res.text());
        setDownloading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      a.download = `transactions_${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="csv-export-widget" style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Export CSV</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {allFields.map((f) => (
          <label key={f} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={selected.includes(f)}
              onChange={() => toggle(f)}
            />
            {f}
          </label>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <input
          placeholder="Search (q)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <button onClick={doExport} disabled={downloading}>
        {downloading ? "Exporting…" : "Export CSV"}
      </button>
    </div>
  );
}
