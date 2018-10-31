var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then(function (document) {
//    console.log(document); 
// }).catch(function (err) {
//     console.log(err);

var cookFood = new Todo({
    text: 'Cook Rice and Beans'
});

cookFood.save().then(function (document) {
   console.log(JSON.stringify(document, null, 2)); 
}).catch(function (err) {
    console.log(err);
});

