// server.js

import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const app = express();

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(json());

// Route Imports
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

// Mount routes with proper base paths
app.use('/api/auth', authRoutes);         // For signup/login
app.use('/api/expenses', expenseRoutes);  // For expense CRUD operations

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker Backend Running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
