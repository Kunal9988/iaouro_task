const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  addExpense,
  getExpenses,
  editExpense,
  deleteExpense
} = require('../controllers/expenseController'); 


router.post('/', verifyToken, addExpense);


router.get('/', verifyToken, getExpenses);


router.put('/:id', verifyToken, editExpense);


router.delete('/:id', verifyToken, deleteExpense);

module.exports = router;
