const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String,
        required: true
    },  
    phone: {
        type: Number,
        required: true
    }, 
    country: {
        type: String,
        required: true
    }, 
    uid: {
        type: String
    },
    lid: {
        type: String
    }
})







const User = mongoose.model('User', userSchema); 

module.exports = User; 
