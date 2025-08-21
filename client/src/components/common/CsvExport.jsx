import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { utils as XLSXUtils, writeFile as writeXLSX } from "xlsx";

const API = import.meta.env.VITE_API_URL;

export default function CsvExport() {
  const { authFetch } = useAuth();

  // Which fields go into Excel
  const [selected, setSelected] = useState(["date", "description", "amount"]);
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

  // Export all (or server-default filtered) transactions to Excel
  const doExportExcel = async () => {
    if (!API) return;
    try {
      setDownloading(true);

      // NOTE: No filters here; if you want this to follow the top Search inputs,
      // we can wire those up via props next.
      const res = await authFetch(`${API}/transactions`);
      if (!res?.ok) {
        const text = await res.text().catch(() => "");
        console.error("Excel export failed", res.status, res.statusText, text);
        return;
      }
      const rows = (await res.json()) || [];

      // Keep only selected fields in the chosen order
      const shaped = rows.map((r) => {
        const obj = {};
        for (const f of selected) obj[f] = r?.[f] ?? "";
        return obj;
      });

      const ws = XLSXUtils.json_to_sheet(shaped, { header: selected });
      const wb = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(wb, ws, "Transactions");

      const stamp = new Date().toISOString().slice(0, 10);
      writeXLSX(wb, `transactions_${stamp}.xlsx`);
    } catch (e) {
      console.error("Excel export error:", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="csv-export-widget" style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Export to Excel</div>

      {/* Field toggles */}
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

      {/* Single button — nothing renders below this */}
      <div style={{ display: "flex" }}>
        <button type="button" onClick={doExportExcel} disabled={downloading}>
          {downloading ? "Exporting…" : "Export Excel"}
        </button>
      </div>
    </div>
  );
}
