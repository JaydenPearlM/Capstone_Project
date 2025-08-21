router.get("/export", async (req, res) => {
  const fields = (req.query.fields || "date,description,amount").split(",");
  const q = req.query.q || "";
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;

  const filter = { user: req.user._id };
  if (q) filter.$text = { $search: q };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = from;
  if (to) filter.date.$lte = to;

  const rows = await Transaction.find(filter).lean();

  const header = fields.join(",");
  const body = rows.map(r => fields.map(f => JSON.stringify(r[f] ?? "")).join(",")).join("\n");
  const csv = header + "\n" + body;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="transactions.csv"');
  res.send(csv);
});
