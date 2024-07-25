import { Router } from 'express';
import productController from '../Controllers/ProductController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';
import imageUploadMiddleware from '../Middlewares/imageUpload.js';

const router = Router();

router.post('/add', authMiddleware, imageUploadMiddleware, productController.addProduct);
router.get('/all', authMiddleware, productController.getProducts);

export default router;
