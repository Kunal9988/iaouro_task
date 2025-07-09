
import express from 'express';
const router = express.Router();


import verifyToken from '../middleware/authMiddleware.js';

// Controller functions
import {
  addExpense,
  getExpenses,
  editExpense,
  deleteExpense
} from '../controllers/expenseController.js';

//Add Expense
router.post('/add', verifyToken, addExpense);

// Get All Expenses for logged-in user
router.get('/my-expenses', verifyToken, getExpenses);

// Edit Expense by ID
router.put('/edit/:id', verifyToken, editExpense);

// Delete Expense by ID
router.delete('/delete/:id', verifyToken, deleteExpense);

export default router;
