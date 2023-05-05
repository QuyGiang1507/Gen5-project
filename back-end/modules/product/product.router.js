const router = require('express').Router();
const productController = require('./product.controller');
const productValid = require('./product.validation');
const validateInput = require('../../common/middlewares/validateInput');
const isAuth = require('../../common/middlewares/isAuth');

router.get(
    '/',
    productController.getProducts
);
router.get(
    '/:productId',
    productController.getProduct
);
router.post(
    '/',
    isAuth,
    validateInput(productValid, 'body'),
    productController.createProduct,
);
router.put(
    '/:productId',
    isAuth,
    productController.updateProduct,
);
router.put(
    '/detete/:productId',
    isAuth,
    productController.deleteProduct
);

module.exports = router;