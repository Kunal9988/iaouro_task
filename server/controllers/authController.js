import db from '../db.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;


import { config } from 'dotenv';
config();

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup Controller
export async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("❌ DB SELECT error:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await hash(password, 10);
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

      db.query(sql, [name, email, hashedPassword], (err) => {
        if (err) {
          console.error("❌ DB INSERT error:", err);
          return res.status(500).json({ message: 'Error saving user' });
        }

        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.error("❌ Error during signup:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

// ✅ Login Controller
export function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("❌ DB SELECT error during login:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' }); // use 401 for unauthorized
    }

    const user = results[0];

    try {
      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        console.warn(`⚠️ Password mismatch for ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '50h' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("❌ Error during login:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}
