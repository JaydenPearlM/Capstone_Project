require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
const logger  = require('./config/logger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./swaggerOptions');
const specs = swaggerJsDoc(options);
const app = express();
const plaidRoutes = require('./routes/Plaidroutes');
const apiRoutes   = require('./routes/index');  // transactions, categories, etc.
const budgetRoutes = require('./routes/budget');
app.set('trust proxy', 1);
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON body parser
app.use(express.json());

// Security Headers
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Basic rate limiter - only allow your frontend
app.use(rateLimit({
  windowMs: 15*60*1000,
  max: 250,
  message: "Too many requests from this IP, please try again later."
}))

app.get('/', (req, res) => {
  res.send(' Cache Budget API is running! ');
})


// Swagger
app.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

//Mongoose schema + CRUD routes ---
const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model('Item', itemSchema);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

app.post('/api/items', async (req, res) => {
  const newItem = await Item.create(req.body);
  res.status(201).json(newItem);
});

app.use('/api/v1/plaid', plaidRoutes);
// app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1', apiRoutes);
// app.use('/api/v1/transactions', transactionRoutes);

app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to Cache Budget API v1',
    endpoints: {
      categories: '/api/v1/categories',
      transactions: '/api/v1/transactions',
      docs: '/api/v1/docs'
    }
  })
})


// Category routes:
const debtRoutes = require('./routes/debtRoutes');
app.use('/api/v1/debts', debtRoutes);

const savingsRoutes = require('./routes/savingsRoutes');
app.use('/api/v1/savings', savingsRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/v1/categories', categoryRoutes);
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/v1/transactions', transactionRoutes);
//budget route
app.use('/api/v1/budget', budgetRoutes);
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