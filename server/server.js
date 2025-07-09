

import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();

app.use(cors());
app.use(json());

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

app.use('/api/auth', authRoutes);        
app.use('/api/expenses', expenseRoutes);  


app.get('/', (req, res) => {
  res.send(' Expense Tracker Backend Running!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
