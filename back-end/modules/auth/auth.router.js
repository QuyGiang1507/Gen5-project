const router = require('express').Router();
const authController = require('./auth.controller');
const authValid = require('./auth.validation');
const validateInput = require('../../common/middlewares/validateInput');
const getUser = require('../../common/middlewares/getUser');
const isAuth = require('../../common/middlewares/isAuth');

router.post(
    '/signup',
    validateInput(authValid.signupSchema, 'body'),
    authController.signUp,
);

router.post(
    '/login',
    validateInput(authValid.loginSchema, 'body'),
    authController.login,
);

router.get(
    '/me',
    getUser,
    authController.getUserInfo,
);

router.get(
    '/verify',
    isAuth,
    authController.verify,
);

router.put(
    '/update-info',
    isAuth,
    authController.updateInfo,
);

router.put(
    '/update-password',
    isAuth,
    authController.updatePassword,
);

module.exports = router;