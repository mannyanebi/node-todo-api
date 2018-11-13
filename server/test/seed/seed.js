

const {ObjectID} = require('mongodb');
const JWT = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

//creating a seed data that will be added into the database because
//the beforeEach function removes all documents from the database

//This is for users
//creating a seed data that will be added into the database because
//the beforeEach function removes all documents from the database
const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoID
}];


const users = [{
    _id: userOneID,
    email: 'user@example.com',
    password: 'userOnePassword',
    tokens: [{
        access: 'auth',
        token: JWT.sign({
            _id: userOneID,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
    }, {
    _id: userTwoID,
    email: 'user2@example.com',
    password: 'userTwoPassword'
}];

const populateTodos = function (done) {
    Todo.remove({}).then(function () {
        return Todo.insertMany(todos);
    }).then(function () {
        done();
    });
};

const populateUsers = function (done) {
    User.remove({}).then(function () {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(function () {
        done();
    });
};

module.exports = {
    todos: todos,
    users: users,
    populateTodos: populateTodos,
    populateUsers: populateUsers
};