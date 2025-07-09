// routes/auth.js

import { Router } from 'express';
import { signup, login } from '../controllers/authController.js';

const router = Router();

// ✅ Route to handle user signup
router.post('/signup', signup);

// ✅ Route to handle user login (connects to DB and checks password)
router.post('/login', login);

export default router;
