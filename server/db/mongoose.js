const mongoose = require ('mongoose');

//telling mongoose Promise that we want to use the default Promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose: mongoose
};