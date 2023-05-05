const router = require('express').Router();
const newsController = require('./news.controller');
const newsValid = require('./news.validation');
const validateInput = require('../../common/middlewares/validateInput');
const isAuth = require('../../common/middlewares/isAuth');

router.get(
    '/',
    newsController.getAllNews
);
router.get(
    '/:newsId',
    newsController.getNews
);
router.post(
    '/',
    isAuth,
    validateInput(newsValid, 'body'),
    newsController.createNews,
);
router.put(
    '/:newsId',
    isAuth,
    newsController.updateNews,
);
router.put(
    '/delete/:newsId',
    isAuth,
    newsController.deleteNews
);

module.exports = router;