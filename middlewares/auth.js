const fitnessItem = require('../models/fitnessItem');

exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else{
        req.flash('warning', 'You are logged in already!');
        req.session.save(() => {
            return res.redirect('/user/profile');
        })
    }
}

exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next();
    } else{
        req.flash('warning', 'You need to login first');
        req.session.save(() => {
            return res.redirect('/user/login');
        })
        
    }
}

exports.isSeller = (req, res, next)=> {
    let id = req.params.id;
    fitnessItem.findById(id)
    .then(item=>{
        if(item){
            if(item.seller == req.session.user){
                next();
            } else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a fitnessitem with the id' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

// middleware to not let author make offer on own item
exports.notSeller = (req, res, next)=> {
    let id = req.params.id;
    fitnessItem.findById(id)
    .then(item=>{
        if(item){
            if(item.seller.toString() !== req.session.user){
                next();
            } else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a fitnessitem with the id' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

