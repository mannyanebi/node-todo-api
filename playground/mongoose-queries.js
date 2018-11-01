const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5bd99e204c4c2a0d48bd169b';

// Todo.find({
//     _id: id
// }).then(function (todos) {
//     console.log('Todos', todos);
// });

User.findById(id).then((user) => {
    if(!user){
        return console.log('User ID not Found');
    }
    console.log(user);
}).catch((err) => {
    console.log(err);
});
