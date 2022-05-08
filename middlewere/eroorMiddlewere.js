var User = require('../models/users');
var flash = require('express-flash');

const emailError = (err, req, res, next) => {
    console.log(err.message, err.code)
  
    if (err.code === 11000) {
      req.flash('error', 'Email is already in use..')
      res.render('signUp_form', {title: 'Create Account'})
      return
    }
    return next()
}

module.exports = emailError