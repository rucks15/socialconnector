//Bring in mangoose library
const mongoose = require('mongoose');
//Bring in Schema from mangoose library
const Schema = mongoose.Schema;

//Create schema
const UserSchema = new Schema ({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String, //Link for the image
        required: false
    },
    date: {
        type: Date,
        default: Date.now //default value for date is filled with current date
    }
});

//create table 'users' based on the schema 'UserSchema'
module.exports = User = mongoose.model('users',UserSchema);