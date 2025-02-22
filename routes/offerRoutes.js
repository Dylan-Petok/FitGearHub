const express = require('express')
const router = express.Router({mergeParams: true})
const controller = require('../controllers/offerController.js');
const {isGuest, isLoggedIn, isSeller, notSeller} = require('../middlewares/auth.js');
const {validateOffer, validateResult} = require('../middlewares/validator.js');

//base route here is /fitnessItems/:id/offers

// get all offers under a specific user and a specific item
router.get('/', isLoggedIn, isSeller, controller.index);

// accept an offer
router.get('/:offerId', isLoggedIn, isSeller, controller.accept);

// make an offer
router.post('/', isLoggedIn, notSeller, validateOffer, validateResult, controller.create);

module.exports = router;