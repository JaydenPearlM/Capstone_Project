function toCsv(rows, headers) {
  //Headers = [{ label: 'Amount', select: (row) => row.amount}]
  const escape = (v) => {
    if (v == null) return '';
    const s = String(v);

     // If value has a quote/comma/newline, wrap in quotes and escape quotes
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const headerLine = headers.map(h => escape(h.label)).join(',');
  const lines = rows.map(r => headers.map(h => escape(h.select(r))).join(','));

  return [headerLine, ...lines].join('\n');
}

module.exports = { toCsv };

