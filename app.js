const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const flashcardsRouter = require('./routes/flashcards');
const decksRouter = require('./routes/decks');


const mongoose = require('./config/mongoose');

const {InvalidParam} = require('node-schema-validator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use((req, res, next) => {
    console.log(req.headers.test);
    const isTest = !!req.headers.test;
    if (isTest) {
        mongoose.startTransaction();
    }
    next();
});
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/decks', decksRouter);


app.use((req, res, next) => {
    if (isTest) {
        mongoose.rollbackTransaction();
    }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {

    if (err instanceof InvalidParam)
        return res.status(400).json(err);


    return res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        stack: err.stack
    });

});

module.exports = app;
