const db = require('../db');


exports.addExpense = (req, res) => {
  const { category, amount, comments } = req.body;
  const userId = req.user.id;

  const sql = `INSERT INTO expenses (user_id, category, amount, comments) VALUES (?, ?, ?, ?)`;

  db.query(sql, [userId, category, amount, comments], (err, result) => {
    if (err) return res.status(500).send("Database error");
    res.status(201).json({ message: "Expense added" });
  });
};


exports.getExpenses = (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.json(results);
  });
};


exports.editExpense = (req, res) => {
  const { id } = req.params;
  const { category, amount, comments } = req.body;
  const userId = req.user.id;

  const sql = `UPDATE expenses SET category=?, amount=?, comments=? WHERE id=? AND user_id=?`;

  db.query(sql, [category, amount, comments, id, userId], (err, result) => {
    if (err) return res.status(500).send("Database error");
    res.json({ message: "Expense updated" });
  });
};


exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `DELETE FROM expenses WHERE id=? AND user_id=?`;

  db.query(sql, [id, userId], (err, result) => {
    if (err) return res.status(500).send("Database error");
    res.json({ message: "Expense deleted" });
  });
};
