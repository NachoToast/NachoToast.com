import express from 'express';

import { login, signup } from '../controllers/user';

const router = express.Router();

router.get('/login', login);
router.get('/signup', signup);

export default router;
