const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {type: String},
    email: {type: String},
    password: {type: String},
});

module.exports = mongoose.model('user', userSchema);