// routes/auth.js

import { Router } from 'express';
import { signup, login } from '../controllers/authController.js';

const router = Router();

//  handle user signup
router.post('/signup', signup);

//  handle user login 
router.post('/login', login);

export default router;
