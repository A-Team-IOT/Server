
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

//TDOD: add options to run without db and users in this config file.
//      add debug mode.
const config = require('./config');

//Change this to match your db dumbass!
mongoose.connect('mongodb://localhost/test');

//connect to mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongoDB");
});

//TODO: use sessions for tracking logins
app.use(cookieParser());
app.use(session({secret: 'Shh, its a secret!', key: 'mmmmCookie', cookie: {maxAge: null}}));

//for parsing requests. Is deprecated, need up update this
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

//make session data availible to any request
app.get('*', function(req, res, next) {
  res.locals.session = req.session;
  next();
});

const webRouter = require('./routes/web_routes/pages');
//TODO only include webTestRouter if debug mode is enabled
const webTestRouter = require('./routes/web_routes/test');
const apiUsersRouter = require('./routes/api/users');

app.use('/', webRouter);
app.use('/test', webTestRouter);
app.use('/api/users', apiUsersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
