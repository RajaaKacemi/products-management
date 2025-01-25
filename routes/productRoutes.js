const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.post('/products', productController.addProduct);
router.delete('/products/:productId', productController.deleteProduct);

module.exports = router;