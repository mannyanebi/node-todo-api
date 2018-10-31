const {ObjectID} = require ('mongodb');
const mongoose = require ('mongoose');

//telling mongoose Promise that we want to use the default Promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// // var newTodo = new Todo({
// //     text: 'Cook dinner'
// // });

// // newTodo.save().then(function (document) {
// //    console.log(document); 
// // }).catch(function (err) {
// //     console.log(err);

// var cookFood = new Todo({
//     text: 'Cook Rice and Beans'
// });

// cookFood.save().then(function (document) {
//    console.log(JSON.stringify(document, null, 2)); 
// }).catch(function (err) {
//     console.log(err);
// });

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

let user1 = new User({
    // email: "mannyanebi@gmail.com"
});

user1.save().then(function (document) {
    console.log(JSON.stringify(document, null, 2));
}).catch(function (err) {
    console.log(err);
});