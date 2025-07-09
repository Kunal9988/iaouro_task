const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker Backend Running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
