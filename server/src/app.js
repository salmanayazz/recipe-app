var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');
var session = require('express-session');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var recipesRouter = require('./routes/recipes');
var imagesRouter = require('./routes/images')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

// expect test config to connect to test MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI);
  console.log(process.env.MONGODB_URI);
  mongoose.connection.on('open', function (ref) { 
    console.log('Connected to mongo server.');
  })
}

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 30*60*1000
}))

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);
app.use('/images', imagesRouter);

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
