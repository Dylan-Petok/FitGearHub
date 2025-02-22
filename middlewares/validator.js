const {body, param} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateFitnessItemId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid fitness item id ' + id);
        err.status = 400;
        return next(err);
    }
    next();
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').notEmpty().trim().escape().normalizeEmail().isEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max:64})];

exports.validateLogin = [body('email', 'Email must be a valid email address').notEmpty().trim().escape(),
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max:64})]; 

exports.validateFitnessItem = [body('condition', 'Must be a valid condition').notEmpty().trim().escape().isIn(['New', 'Like New', 'Used - Good', 'Used - Fair', 'Used - Acceptable']),
body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('price', 'Must be a valid price').notEmpty().trim().escape().custom(value => {
    if (parseFloat(value) === 0) { 
        throw new Error('Price must be greater than 0');
    }
    return true}).isCurrency({ 
    allow_negatives: false,  
    digits_after_decimal: [2], 
}),
body('details', 'Details cannot be empty').notEmpty().trim().escape()];

exports.validateSearch = [param('search', 'Must be a valid search').trim().escape()]

exports.validateOffer = [body('amount', 'Must be a valid amount').trim().escape().notEmpty().custom(value => {
    if (parseFloat(value) === 0) { 
        throw new Error('Price must be greater than 0');
    }
    return true}).isCurrency({ 
    allow_negatives: false,  
    digits_after_decimal: [2], 
})]

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        req.session.save(() => {
            res.redirect('back');
        });
    } else {
        return next();
    }
}