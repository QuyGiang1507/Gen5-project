const router = require('express').Router();
const cartController = require('./cart.controller');
const isAuth = require('../../common/middlewares/isAuth');

router.post(
    "/",
    isAuth,
    cartController.addItemToCart,
);

router.get(
    "/",
    isAuth,
    cartController.getCart,
);

router.put(
    "/",
    isAuth,
    cartController.updateCart,
);

router.put(
    "/empty-cart",
    isAuth,
    cartController.emptyCart,
);

router.put(
    "/remove-item",
    isAuth,
    cartController.removeItemFromCart,
);

router.put(
    "/buy-product",
    isAuth,
    cartController.buyProduct,
);

module.exports = router;