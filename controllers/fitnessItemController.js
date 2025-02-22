// import / create a variable importing the fitness item model so we can use the array of fitness items we statically made
const model = require('../models/fitnessItem')
const user = require('../models/user')
const offer = require('../models/offer')


exports.index = (req, res, next) => {
    const search = req.query.search || '';
    model.find({ active: true, title : {$regex: search, $options: 'i' } })
    .sort({ price: 1 })
    .then((items) => {
        if(items.length === 0){
            return model.find({ active: true }).sort({ price: 1}).then(allItems => {
                return { items: allItems, noResults: true };
            });
        } else {
            return { items, noResults: false };
        }
   })
    .then((result) => {
        res.render('./fitnessitem/index.ejs', { items: result.items, noResults: result.noResults  })
    })
   .catch(err=> {
        next(err);
   })
};

exports.toggle = (req, res) => {
    let fitnessItems = model.toggleFilter();
    res.redirect('/fitnessItems');
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    console.log(id)
     model.findById(id).populate('seller').populate('offers')
     .then(item=>{
        if(item){
            res.render('./fitnessitem/show.ejs', {item});
        } else {
            let err = new Error('Cannot find a fitness item with id ' + id);
            err.status = 404;
            next(err);
        }
     })
     .catch(err=> next(err));
};

exports.new = (req, res) => {
    res.render('./fitnessitem/new.ejs');
};

exports.create = (req, res, next) => {
    console.log(req.body)
    let newFitnessItem =  new model(req.body);

      // Fetch the user's details from the database
      user.findById(req.session.user)
      .then(user => {
          if (!user) {
              let err = new Error('User not found');
              err.status = 404;
              throw err;
          }

    newFitnessItem.seller = req.session.user;
    if(req.file){
        image_path = '/images/' + req.file.filename;
        newFitnessItem.image = image_path;
        console.log(image_path)
    };
    newFitnessItem.save()
    req.flash('success', 'New fitness item created!')
})
    .then((item)=>{
        req.session.save(() => {
            res.redirect('/fitnessItems')})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(item => {
        if(item) {
            res.render('./fitnessitem/edit.ejs', {item});
        } else {
            let err = new Error('Cannot find a fitnessitem with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> next(err));
};


exports.update = (req, res, next)=>{
    let item = req.body;
    let id = req.params.id;
    if(req.file){
        item.image = '/images/' + req.file.filename;
    }

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item){
            req.flash('success', 'Your item was updated successfully!')
            req.session.save(() => {
                res.redirect('/fitnessItems/'+id);
            })
        }  else {
            let err = new Error('Cannot find a fitnessItem with id ' + id);
                err.status = 404;
                next(err);
        }
    })
    .catch(err => {
        if(err.name === "ValidationError")
            err.status = 400;
        next(err);
});
};

exports.delete = (req, res, next) => {
    const id = req.params.id;

    model.findById(id)
        .then(item => {
            if (!item) {
                const err = new Error('Cannot find a fitnessItem with id ' + id);
                err.status = 404;
                throw err;
            }

            
            return offer.deleteMany({ item: id })
                .then(() => item.deleteOne()); 
        })
        .then(() => {
            req.flash('success', 'Your item was deleted successfully!');
            req.session.save(() => {
                res.redirect('/fitnessItems');
            });
        })
        .catch(err => {
            console.error('Error during cascade delete:', err);
            next(err);
        });
};



