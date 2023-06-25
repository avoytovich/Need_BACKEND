const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Set up the express app
const app = express();

const jwt = require('jsonwebtoken');

const token = req => req.headers['x-access-token'];
const tokenFreeURLs = ['/login', '/token'];
const checkURL = baseUrl => tokenFreeURLs.some(URL => baseUrl.match(URL));
const verifyToken = (token, res, req, next) => jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) =>
  err && res.status(401).json({message: 'token is not valid'}) ||
  (req.decoded = decoded) && next()
);

// Log requests to the console.
app.use(logger('dev'));

app.use(cors());

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('*', (req, res, next) => {
  if (checkURL(req.baseUrl)) {
    return next();
  }
  !token(req) && !checkURL(req.baseUrl) && res.status(401).json({message: 'no token'}) ||
  token(req) && verifyToken(token(req), res, req, next);
});

require('./routes')(app);

if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.'
}));

module.exports = app;
