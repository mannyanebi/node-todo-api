const validator = require('validator');
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const Bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//overriding the toJSON method that executes
//res.send() so that instead of the whole document properties
//we will use _.pick to select necessary properties to send back 
//to client
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//creating a method in the methods object to 
//generate and hash an authentication key
//save it to the database
//then returns the token
UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = JWT.sign({
        id: user._id.toHexString(),
        access: access
    }, 'Yeshua').toString();

    user.tokens.push({
        access: access,
        token: token
    });

    return user.save().then(function () {
        return token;
    });
};

UserSchema.statics.findByToken =  function (token) {
    let User = this;
    let decoded;

    try {
        decoded = JWT.verify(token, 'Yeshua');
    } catch (err) {
        return new Promise(function (resolve, reject) {
            reject('Invalid Signature');
        });
    }

    return User.findOne({
        '_id': decoded.id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        //Using callbacks

        // Bcrypt.genSalt(10, function (err, salt) {
        //     Bcrypt.hash(user.password, salt, function (err, hash) {
        //         user.password = hash;
        //         next();
        //     });
        // });

        //Using promises
        Bcrypt.genSalt(10).then(function (salt) {
            Bcrypt.hash(user.password, salt).then(function (hash) {
                       user.password = hash;
                       next();
                });
            }).catch(function (err) {
                    }); 
            } else {
                next();
            }
        });

//Instance method to remove a token object from a user
//This is done when the user is logging off from the system

UserSchema.methods.removeToken = function (token) {
    //this object is only useable in the function called
    //using the function keyword and not arrow functions
    //So this points to the user (instance of User) that calls removeToken
    var user = this;

    //this returns a promise
    return user.update({
        //this finds a the object that contains the search parameter
        //given below and returns that object
        //i.e. when you search token, it returns the tokens object
        $pull: {
            tokens: {
                token: token
            }
        }
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};