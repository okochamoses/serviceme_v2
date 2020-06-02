const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const path = require('path');
const logger = require("./config/logger");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
