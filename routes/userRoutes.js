const express = require('express');
const controller = require('../controllers/userController.js');
const {isGuest, isLoggedIn} = require('../middlewares/auth.js');
const {validateSignUp, validateLogin, validateResult} = require('../middlewares/validator.js');


const router = express.Router();

router.get('/new', isGuest, controller.new)
router.post('/', isGuest, validateSignUp, validateResult, controller.create);
router.get('/login', isGuest, controller.login);
router.post('/login', isGuest, validateLogin, validateResult, controller.authenticate);
router.get('/profile', isLoggedIn, controller.showProfile);
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;