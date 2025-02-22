//require express to use the express.router function
const express = require('express');
const multer = require('multer')
const offerRoutes = require('./offerRoutes');

// create a controller variable to use the functions in the controller which contains the logic for what happens with the routes
const controller = require('../controllers/fitnessItemController')

const {isLoggedIn, isSeller} = require('../middlewares/auth.js');
const {validateFitnessItemId, validateFitnessItem, validateResult, validateSearch} = require('../middlewares/validator.js');



// create the router so we can then use it to route requests, the controller page handles the logic
const router = express.Router();


//initialize multer and choose where to store uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image')


// the seven restful routes for /fitnessItems

// index // show the root page, for fitnessitems, get all fitness items
router.get('/', validateSearch, validateResult, controller.index);

router.post('/toggle', controller.toggle);

//new // show a form to create a fitness item
router.get('/new', isLoggedIn, controller.new)

//show // show a single fitness item
router.get('/:id', validateFitnessItemId, controller.show)

//create // create a new fitness item
router.post('/', upload, isLoggedIn, validateFitnessItem, validateResult, controller.create)

//edit // show a form to edit a fitness item
router.get('/:id/edit', isLoggedIn, isSeller, validateFitnessItemId, controller.edit)

//update // update a specific fitness item by id
router.put('/:id', upload, isLoggedIn, isSeller, validateFitnessItemId, validateFitnessItem, validateResult, controller.update)

//destroy // delete a specific fitness item
router.delete('/:id', isLoggedIn, isSeller, validateFitnessItemId, controller.delete)

router.use('/:id/offers', offerRoutes)

module.exports = router;
