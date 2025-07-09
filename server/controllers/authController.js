const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  console.log("📩 Signup request received:", name, email);

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("❌ DB error on SELECT:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("❌ DB error on INSERT:", err);
            return res.status(500).json({ message: 'Error saving user' });
          }

          console.log("✅ User registered successfully:", result.insertId);
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (error) {
      console.error("❌ Server error during signup:", error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  });
};

// ✅ Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("❌ DB error on LOGIN SELECT:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      console.log("❌ User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("❌ Server error during login:", error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });
};
