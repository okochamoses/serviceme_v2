const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const path = require('path');
const logger = require("./config/logger");

require("./config/db");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authenticationRouter = require('./routes/authentication');
const providerRouter = require('./routes/provider');
const locationRouter = require('./routes/locations');
const categoryRouter = require('./routes/categories');
const businessRouter = require('./routes/businesses');
const visitorRouter = require('./routes/visitors');
const requestRouter = require('./routes/requests');

const {processSessionToken} = require("./middleware/authMiddleware")

const app = express();

app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v2/auth', authenticationRouter);
app.use('/api/v2/providers', providerRouter);
app.use('/api/v2/locations', locationRouter);
app.use('/api/v2/categories', categoryRouter);
app.use('/api/v2/businesses', businessRouter);
app.use('/api/v2/visitors', visitorRouter);
app.use('/api/v2/requests', requestRouter);

module.exports = app;
