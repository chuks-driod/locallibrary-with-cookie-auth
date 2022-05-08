var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController')

/// USERS ROUTS ///

// GET request for Sign Up.
router.get('/signUp', users_controller.user_signUp_get)

// POST request for Sign Up.
router.post('/signUp', users_controller.user_signUp_post)

// GET request for Log In
router.get('/logIn', users_controller.user_login_get);

// POST request for Log In.
router.post('/logIn', users_controller.user_login_post)

// GET request for Log Out
router.get('/logOut', users_controller.logout_get)

module.exports = router;
