const model = require('../models/user');
const fitnessItem = require('../models/fitnessItem');
const offer = require('../models/offer')

exports.new = (req, res)=>{
    return res.render('./user/new')
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    fitnessItem.seller = req.session.user;
    user.save()
    .then(user=>{
        req.flash('success', 'Registration Succeeded!')
        req.session.save(() => {
            return res.redirect('/user/login');
        })
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            req.session.save(() => {
                return res.redirect('/user/new');
            })
        }
        else if(err.code === 11000){
            req.flash('warning', 'Email has been used');
            req.session.save((saveErr) => {
                if(saveErr){
                    return res.status(500).send('Internal Server Error');
                }
                return res.redirect('/user/new');
            })
        } else {
            next(err);
        }
        
    });
};

exports.login = (req, res, next)=>{
    return res.render('./user/login')
};

exports.authenticate = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email})
    .then(user => {
        if(!user){
            console.log('Incorrect email address');
            req.flash('warning', 'Incorrect email addresss');
            req.session.save(() => {
                return res.redirect('/user/login');
            })
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    req.session.save(() => {
                        return res.redirect('/user/profile');
                    })
                } else {
                    req.flash('warning', 'Incorrect password');
                    req.session.save(() => {
                        return res.redirect('/user/login');
                    })
                }
            });
        }
    })
    .catch(err => next(err));
};

exports.showProfile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), fitnessItem.find({seller: id}), offer.find({buyer: id}).populate('item')])
    .then(results=>{
        const [user, fitnessItems, offers] = results;
        res.render('./user/profile', {user, fitnessItems, offers})
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};