const mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
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