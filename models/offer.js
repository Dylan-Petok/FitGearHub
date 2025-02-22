const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, 'cannot be empty'], min:[0.01, 'amount must be greater than or equal to 0.01']},
    status: {type: String, enum:['pending', 'rejected', 'accepted'], default: 'pending'},
    buyer: {type: Schema.Types.ObjectId, ref: 'User', require: [true, 'Buyer is required']},
    item: {type: Schema.Types.ObjectId, ref: 'Item', require: [true, 'Fitness Item is required']}
});


module.exports = mongoose.model('Offer', offerSchema)