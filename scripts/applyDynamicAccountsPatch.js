// scripts/applyDynamicAccountsPatch.js
// Run with: node scripts/applyDynamicAccountsPatch.js
// What it does:
// - Adds accountCategory to Card model
// - Allows accountCategory in cardController create
// - Replaces AccountsCard & DebtCard to use live totals (no hardcoded numbers)
// - Fixes CSV header quote in reportController
// - Writes .bak backups next to each file

const fs = require("fs");
const path = require("path");

const files = {
  cardModel: "server/models/Card.js",
  cardController: "server/controllers/cardController.js",
  accountsCard: "client/src/components/UI/AccountsCard.jsx",
  debtCard: "client/src/components/UI/DebtCard.jsx",
  reportController: "server/controllers/reportController.js",
};

function read(p) {
  return fs.readFileSync(p, "utf8");
}
function writeBackup(p, text) {
  fs.writeFileSync(p + ".bak", text, "utf8");
}
function write(p, text) {
  // always use LF to avoid CRLF patchiness
  fs.writeFileSync(p, text.replace(/\r\n/g, "\n"), "utf8");
}
function exists(p) {
  return fs.existsSync(p);
}
function logOK(msg) {
  console.log("✅ " + msg);
}
function logSkip(msg) {
  console.log("↪️  " + msg);
}
function logDo(msg) {
  console.log("→ " + msg);
}

function replaceOnce(src, find, repl) {
  if (src.includes(find)) {
    return src.replace(find, repl);
  }
  return null;
}

function ensureAccountCategoryInModel(text) {
  if (/accountCategory\s*:/.test(text)) return { changed: false, out: text };

  // Try inserting after the line with enum: ['credit', 'debit']
  const lines = text.split("\n");
  const idx = lines.findIndex((ln) => /enum:\s*\[\s*['"]credit['"]\s*,\s*['"]debit['"]\s*\]/.test(ln));
  if (idx !== -1) {
    lines.splice(
      idx + 1,
      0,
      "  accountCategory: { type: String, enum: ['checking', 'savings'], default: null },"
    );
    return { changed: true, out: lines.join("\n") };
  }

  // Fallback: insert before balance or before createdAt
  let out = text.replace(
    /balance\s*:\s*\{\s*type:\s*Number[^}]*\},/m,
    (m) => `${m}\n  accountCategory: { type: String, enum: ['checking', 'savings'], default: null },`
  );
  if (out !== text) return { changed: true, out };

  out = text.replace(
    /createdAt\s*:\s*\{\s*type:\s*Date[^}]*\}/m,
    (m) => `  accountCategory: { type: String, enum: ['checking', 'savings'], default: null },\n${m}`
  );
  if (out !== text) return { changed: true, out };

  throw new Error("Could not insert accountCategory into Card.js automatically.");
}

function ensureControllerAcceptsAccountCategory(text) {
  let changed = false;
  // Destructuring line in create()
  let updated = text.replace(
    /const\s*\{\s*([^}]*)\}\s*=\s*req\.body\s*;/m,
    (full, inner) => {
      // only target the one containing 'balance' (the create destructure)
      if (!/balance\b/.test(inner)) return full;
      if (/accountCategory\b/.test(inner)) return full; // already there
      changed = true;
      return `const { ${inner.trim().replace(/\s+$/, "")}, accountCategory } = req.body;`;
    }
  );

  // payload in create()
  const payloadFind = /const\s+payload\s*=\s*\{\s*([^}]*)\}\s*;/m;
  updated = updated.replace(payloadFind, (full, inner) => {
    if (!/\bbalance\b/.test(inner)) return full; // target the main payload
    if (/\baccountCategory\b/.test(inner)) return full;
    changed = true;
    const withAC = inner.trim().length ? inner.trim() + ", accountCategory" : "accountCategory";
    return `const payload = { ${withAC} };`;
  });

  return { changed, out: updated };
}

function makeAccountsCard() {
  return `
import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import "./dashboardCards.css";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function AccountCard() {
  const [checking, setChecking] = useState(0);
  const [savings, setSavings] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(\`\${API}/cards\`);
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
    <Link to="/CardManagement">
      <Card>
        <CardContent className="accounts">
          <h2>Account Balance</h2>
          {error ? (
            <p className="amount">Error: {error}</p>
          ) : (
            <p className="amount">
              Checking: \${checking.toFixed(2)}
              <br />
              Savings: \${savings.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
`.trimStart();
}

function makeDebtCard() {
  return `
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
        const res = await fetch(\`\${API}/debts\`);
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
`.trimStart();
}

function fixReportHeader(text) {
  return text.replace(
    `filename="transactions.csv`,
    `filename="transactions.csv"`
  );
}

function run() {
  const root = process.cwd();

  // 1) Card model
  {
    const p = path.join(root, files.cardModel);
    if (!exists(p)) throw new Error("Missing " + files.cardModel);
    const src = read(p);
    writeBackup(p, src);
    const res = ensureAccountCategoryInModel(src);
    write(p, res.out);
    res.changed ? logOK("Added accountCategory to Card model") : logSkip("Card model already had accountCategory");
  }

  // 2) cardController
  {
    const p = path.join(root, files.cardController);
    if (!exists(p)) throw new Error("Missing " + files.cardController);
    const src = read(p);
    writeBackup(p, src);
    const res = ensureControllerAcceptsAccountCategory(src);
    write(p, res.out);
    res.changed ? logOK("cardController: now accepts & persists accountCategory") : logSkip("cardController already handled accountCategory");
  }

  // 3) AccountsCard.jsx
  {
    const p = path.join(root, files.accountsCard);
    if (!exists(p)) throw new Error("Missing " + files.accountsCard);
    const src = read(p);
    writeBackup(p, src);
    write(p, makeAccountsCard());
    logOK("AccountsCard: now computes live Checking/Savings totals");
  }

  // 4) DebtCard.jsx
  {
    const p = path.join(root, files.debtCard);
    if (!exists(p)) throw new Error("Missing " + files.debtCard);
    const src = read(p);
    writeBackup(p, src);
    write(p, makeDebtCard());
    logOK("DebtCard: now sums /debts for live total");
  }

  // 5) reportController header fix
  {
    const p = path.join(root, files.reportController);
    if (!exists(p)) throw new Error("Missing " + files.reportController);
    const src = read(p);
    writeBackup(p, src);
    const out = fixReportHeader(src);
    if (out !== src) {
      write(p, out);
      logOK('Fixed CSV header: Content-Disposition filename="transactions.csv"');
    } else {
      logSkip("CSV header already correct");
    }
  }

  console.log("\nAll set. Restart server & client to test.");
}

run();
