
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
global.winston = require('./winston');

global.config = require('./config');

winston.level = (config.debugMode ? "debug" : "error");


//This doesn't work with nodemon... Need to figure out how to get both to work at the same time.
/*
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(config.optionDefinitions);
config.debugMode = (options.debugmode != undefined ? options.debugmode : false);
config.singleUserMode = (options.singleuser != undefined ? options.singleuser : false);
**/

winston.info("debugMode: " + config.debugMode);
winston.info("singleUserMode: " + config.singleUserMode);


//Change this to match your db dumbass!d
mongoose.connect('mongodb://localhost/test');

//connect to mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  winston.info("connected to mongoDB");
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

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

//make session data availible to any request
app.get('*', function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.locals.session = req.session;
  next();
});

const webRouter = require('./routes/web_routes/pages');
//TODO only include webTestRouter if debug mode is enabled
const webTestRouter = require('./routes/web_routes/test');
const apiUsersRouter = require('./routes/api/users');

app.use('/', webRouter);
if(config.debugMode){
  app.use('/test', webTestRouter);
}
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
  res.render('pages/error');
});



module.exports = app;
