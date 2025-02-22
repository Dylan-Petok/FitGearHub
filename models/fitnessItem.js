const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Offer = require('./offer');

const Schema = mongoose.Schema;

const fitnessItemSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Seller is required']},
    condition: {type: String, required: [true, 'Condition is required']},
    price: {type: Number, required: [true, 'Price is required']},
    details: {type: String, required: [true, 'Details are required']},
    image: {type: String, default: '/images/default.jpg'},
    active: {type: Boolean, default: true},
    offers: [{type: Schema.Types.ObjectId, ref: 'Offer'}],
},
{timestamps: true}
);


module.exports = mongoose.model('Item', fitnessItemSchema);





