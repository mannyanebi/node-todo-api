const mongoose = require ('mongoose');

//telling mongoose Promise that we want to use the default Promise library
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// mongoose.connect('process.env.MONGODB_URI || mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
}).then(function () {
    
}).catch(function (err) {
    console.log(err.message);
});
// mongoose.connect('mongodb://adminAnebi:mannyanebi47@ds149593.mlab.com:49593/todoapp || mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose: mongoose
};