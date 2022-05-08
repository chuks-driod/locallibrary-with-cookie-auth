var User = require('../models/users');
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var flash = require('express-flash');
// var emailError = require('../middlewere/eroorMiddlewere')

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
}

exports.user_signUp_get = function(req, res, next) {
  res.render('signUp_form', {title: 'Create Account'})
}


exports.user_signUp_post = [
  
  body("firstName").trim().escape().isLength({min: 3, max: 50}).withMessage("First name required."),
  body("lastName").trim().escape().isLength({min: 3, max: 50}).withMessage("Last name required."),
  // body("email").trim().escape().isLength({min: 3, max: 50}).withMessage("Email required. And must be valid email."),
  body("password").trim().escape().isLength({min: 6, max: 50}).withMessage("Password must be 6 characters long."),


  (req, res, next) => {
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('signUp_form', { title: 'Create Account', user: req.body, errors: errors.array()})
      return

    }
    else {
      var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      })

      user.save(function(err) {
        if (err) { return next(err)}

        // Data form is valid create a token and redirect to home page.      
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // req.flash("messages", "Thank you for joining.");
        res.redirect("/");
      });
    }

  }

]

exports.user_login_get = function(req, res, next) {
    res.render('logIn_form', { title: 'LogIn' })
}

exports.user_login_post = [

    body("email").trim().escape().isLength({min: 3, max: 50}).withMessage("Email required. And must be valid email."),
    body("password").trim().escape().isLength({min: 6, max: 50}).withMessage("Incorrect email or password."),


    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('login_form', { title: 'LogIn', user: req.body, errors: errors.array() });
          return
        }
        else {

          User.findOne( {email: req.body.email} ).then( function (user) {

            if (user) {
              // Email exist lets compare the request password and the database password
              const auth = bcrypt.compare(req.body.password, user.password);
              if (auth) {
                const token = createToken(user._id);
                // Password Is Correct Set Cookies Then Redirect To Home Page
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(302).redirect('/')
              }

            }
          }).catch(next)
        }
    }

]


exports.logout_get = function (req, res) {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/user/logIn');
}