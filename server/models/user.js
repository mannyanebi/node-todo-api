const validator = require('validator');
const mongoose = require('mongoose');

var User = mongoose.model('User', {
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

// let user1 = new User({
//     // email: "mannyanebi@gmail.com"
// });

// user1.save().then(function (document) {
//     console.log(JSON.stringify(document, null, 2));
// }).catch(function (err) {
//     console.log(err);
// });

module.exports = {
    User: User
};