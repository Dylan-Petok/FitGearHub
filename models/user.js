const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, requied: [true, 'cannot be empty'], unique: true},
    password: {type: String, required: [true, 'cannot be empty']}
});

//replacing plaintext password with hashed password before saving document in database
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    }
)
    .catch(err=>next(err));
});

//method to compare the login password and the hash stored in the database
userSchema.methods.comparePassword = function(loginPassword){
    return bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model('User', userSchema)