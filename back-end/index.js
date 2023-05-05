
const express = require('express');
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const log = require('./common/middlewares/log');
const errorHandler = require('./common/errorHandler');
const HttpError = require('./common/httpError');
const AuthRouter = require('./modules/auth');
const ProductRouter = require('./modules/product');
const NewsRouter = require('./modules/news');
const UploadRouter = require('./modules/upload');
const CartRouter = require('./modules/cart');

async function Main() {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Mongodb connected");

    const app = express();

    app.use(cors());
    app.use(log);
    app.use(express.json());

    app.use(express.static('public'));

    app.use('/api/auth', AuthRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/news', NewsRouter);
    app.use('/api/upload', UploadRouter);
    app.use('/api/cart', CartRouter)

    app.use('*', (req, res) => {
        throw new HttpError('Not found api', 404);
    })
    
    app.use(errorHandler);

    app.listen(process.env.PORT || 9000, (err) => {
        if(err) throw err;

        console.log('Server connected');
    });
}

Main();
