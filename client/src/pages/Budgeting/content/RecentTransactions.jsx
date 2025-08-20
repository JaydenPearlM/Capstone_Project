export default function RecentTransactions({ filteredTransactions }) {
  const handleScroll = () => {
    const el = document.getElementById("transactions-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="recent-transactions" onClick={handleScroll} style={{ cursor: "pointer" }}>
      <h3>Recent Transactions</h3>
      <div className="recent-transactions-list">
        {filteredTransactions
          .slice(-5)
          .reverse()
          .map((tx) => (
            <div key={tx.id || tx._id} className="recent-tx-item">
              <span className="tx-date">
                {tx.date.slice(5, 7)}/{tx.date.slice(8, 10)} {/* MM/DD */}
              </span>
              <span className="tx-description">{tx.description || "No description"}</span>
              <span className={`tx-amount ${tx.type === "income" ? "income" : "expense"}`}>
                {tx.type === "income" ? "+" : "-"}${tx.amount}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
