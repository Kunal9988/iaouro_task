import db from '../db.js'; // Import the default MySQL connection

// ✅ Add Expense
export function addExpense(req, res) {
  const { category, amount, comments } = req.body;
  const userId = req.user.id;

  const sql = `INSERT INTO expenses (user_id, category, amount, comments) VALUES (?, ?, ?, ?)`;

  db.query(sql, [userId, category, amount, comments], (err) => {
    if (err) {
      console.error("❌ Error inserting expense:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Expense added" });
  });
}

// ✅ Get Expenses for logged-in user
export function getExpenses(req, res) {
  const userId = req.user.id;

  const sql = `SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching expenses:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
}

// ✅ Edit Expense
export function editExpense(req, res) {
  const { id } = req.params;
  const { category, amount, comments } = req.body;
  const userId = req.user.id;

  const sql = `UPDATE expenses SET category=?, amount=?, comments=?, updated_at=NOW() WHERE id=? AND user_id=?`;

  db.query(sql, [category, amount, comments, id, userId], (err, result) => {
    if (err) {
      console.error("❌ Error editing expense:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Expense updated" });
  });
}

// ✅ Delete Expense
export function deleteExpense(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `DELETE FROM expenses WHERE id=? AND user_id=?`;

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error("❌ Error deleting expense:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Expense deleted" });
  });
}
