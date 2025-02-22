const fitnessItem = require('../models/fitnessItem');
const offer = require('../models/offer');


exports.index = (req, res, next) => {
   let fitnessItemId = req.params.id;
   console.log(fitnessItem)
   fitnessItem.findById(fitnessItemId).populate({
    path: 'offers',
    populate: {
        path: 'buyer',
        model: 'User'
    }
})
   .then(fitnessItem=> res.render('./offer/offer.ejs', {fitnessItem}))
};

exports.accept = (req, res, next) => {
    let fitnessItemId = req.params.id;
    let offerId = req.params.offerId;

    console.log(fitnessItemId);
    console.log(offerId);

    fitnessItem.findById(fitnessItemId)
        .then(fitnessItem => {
            if (!fitnessItem) {
                let err = new Error('Fitness item not found!');
                err.status = 404;
                return next(err);
            }

            const savePromises = fitnessItem.offers.map(offerIdInArray =>
                offer.findById(offerIdInArray)
                    .then(offerDoc => {
                        if (!offerDoc) {
                            console.log(`Offer with ID ${offerIdInArray} not found!`);
                            let err = new Error('Offer not found');
                            err.status = 404;
                            return next(err);
                        }

                        if (offerDoc._id.toString() === offerId) {
                            offerDoc.status = 'accepted';
                        } else {
                            offerDoc.status = 'rejected';
                        }

                        return offerDoc.save();
                    })
            );

            return Promise.all(savePromises)
                .then(() => {
                    fitnessItem.active = false;
                    return fitnessItem.save();
                });
        })
        .then(() => {
            req.flash('success', 'Offer accepted successfully!');
            req.session.save(() => {
                res.redirect(`/fitnessItems/${fitnessItemId}/offers/`);
            });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};




exports.create = (req, res, next) => {
    let fitnessItemId = req.params.id;
    let amount = req.body.amount;
    let buyer = req.session.user;

    fitnessItem.findById(fitnessItemId)
        .then(item => {
            if (!item) {
                let err = new Error('Fitness item not found');
                err.status = 404;
                return next(err);
            }

            let newOffer = new offer({
                amount: amount,
                buyer: buyer,
                item: fitnessItemId,
            });

            return newOffer.save()
                .then(savedOffer => {
                    item.offers.push(savedOffer._id);
                    return item.save(); 
                });
        })
        .then(() => {
            req.flash('success', 'Your offer was sent successfully!');
            req.session.save(() => {
                res.redirect(`/fitnessItems/${fitnessItemId}`);
            });
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            console.error(err);
            next(err);
        });
};