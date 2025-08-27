require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./config/logger");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("./swaggerOptions");
const specs = swaggerJsDoc(options);

const app = express();

const plaidRoutes = require("./routes/Plaidroutes");
const apiRoutes = require("./routes/index"); // transactions, categories, etc.
const budgetRoutes = require("./routes/budget");
const cardRoutes = require("./routes/cardRoutes");

// ✅ Add a canonical list of allowed frontend origins (local + production)
const FRONTEND_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://cache-budgeting.onrender.com",     // your older frontend
  "https://capstone-project-f.onrender.com",  // ✅ your current frontend
];

// Trust proxy if behind one
app.set("trust proxy", 1);

// JSON body parser
app.use(express.json());

// ✅ CORS FIRST (before helmet and before routes)
// 🔧 FORCE CORS HEADERS FOR ALL RESPONSES
const ALLOWED = new Set([
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://cache-budgeting.onrender.com",
  "https://capstone-project-f.onrender.com", // your current frontend
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Debug log — see what’s hitting the server
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} Origin:${origin || "n/a"}`);

  if (req.method === "OPTIONS") return res.sendStatus(204); // preflight
  next();
});
  app.use(cors({
    origin: FRONTEND_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // set true only if you use cookies/sessions + fetch(..., { credentials: 'include' })
  }));
  
// ✅ Ensure preflight responses for any route
app.options("*", cors({ origin: FRONTEND_ORIGINS }));

// Security headers (after CORS)
app.use(helmet());

// Basic rate limiter (optional)
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 250,
//   message: "Too many requests from this IP, please try again later."
// }))

// HEALTH
app.get("/", (req, res) => {
  res.send(" Cache Budget API is running! ");
});

// ✅ Add an explicit health route under the API prefix for quick client tests
app.get("/api/v1/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Swagger
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(specs));

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Demo test model/routes (left as-is)
const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", itemSchema);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend API!" });
});

app.post("/api/items", async (req, res) => {
  const newItem = await Item.create(req.body);
  res.status(201).json(newItem);
});

// --- REAL API ROUTES ---
app.use("/api/v1/plaid", plaidRoutes);

// Auth routes (no authentication required)
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

// Mount the cards router under the API namespace (FIX)
// ❌ was: app.use("/dashboard/cardManagement", cardRoutes);
app.use("/api/v1/cards", cardRoutes);

// Aggregated routes (categories, transactions, etc.)
app.use("/api/v1", apiRoutes);

// Category routes:
const debtRoutes = require("./routes/debtRoutes");
app.use("/api/v1/debts", debtRoutes);

const savingsRoutes = require("./routes/savingsRoutes");
app.use("/api/v1/savings", savingsRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/v1/categories", categoryRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/v1/transactions", transactionRoutes);

// Budget route
app.use("/api/v1/budget", budgetRoutes);

// Version info
app.get("/api/v1", (req, res) => {
  res.json({
    message: "Welcome to Cache Budget API v1",
    endpoints: {
      categories: "/api/v1/categories",
      transactions: "/api/v1/transactions",
      cards: "/api/v1/cards",
      docs: "/api/v1/docs",
    },
  });
});

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong." });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
