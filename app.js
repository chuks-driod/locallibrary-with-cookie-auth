var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { validationResult } = require('express-validator');
// var flash = require('connect-flash');
var flash = require('express-flash');
var session = require('express-session');


//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://mongoose:PKyFZ3VU3KqTPkw@cluster0.qnygo.mongodb.net/local_library?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// var { authication, checkUser } = require('./middlewere/authMiddlewere')
var authication = require('./middlewere/authMiddlewere')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression()); //Compress all routes
app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('keyboard cat'));
app.use(session({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/catalog', authication, catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message, err.code;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const errors = validationResult(req);


  if (err.code != 11000) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  else if (errors.isEmpty()) {
    req.flash('error', 'Email already in use.')

    res.status(400).render('signUp_form', { title: 'Create Account', user: req.body, errors: errors.array()})


  }
  else {
    // Render the form again with the ERROR message.
    req.flash('error', 'Email already in use.')
    res.status(400).render('signUp_form', { title: 'Create Account', user: req.body, errors: errors.array()})
  }
  
  // SET DEBUG=express-locallibrary-tutorial:* & npm start
});

module.exports = app;