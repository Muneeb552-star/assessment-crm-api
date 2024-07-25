import { Router } from 'express';
import authController from '../Controllers/authController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = Router();

router.post('/login', authController.userLogin);
router.post('/register', authController.userRegister);
router.get('/logout', authMiddleware, authController.logout);

export default router;
