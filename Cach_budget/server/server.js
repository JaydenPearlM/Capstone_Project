require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB connection error:', err));

//Mongoose schema + CRUD routes ---
const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model('Item', itemSchema);

app.get('/api/hello', (req, res) => {
  res.json({ message: '👋 Hello from the backend!' });
});

app.get('/', (req, res) => {
  res.send('👋 Hello from the backend!');  
});

app.post('/api/items', async (req, res) => {
  const newItem = await Item.create(req.body);
  res.status(201).json(newItem);
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
