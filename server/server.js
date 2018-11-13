require('./config/config');
//library imports
const _ = require('lodash');
const express = require('express');
const BodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const Bcrypt = require('bcryptjs');
//local requirements
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require ('./middleware/authenticate.js');

var app = express();
const PORT =  process.env.PORT;
// const PORT =  process.env.PORT || 3000;

app.use(BodyParser.json());

//this sends todo data to the database 
//creating a new todo with only a text property
//This authenticate middleware, now allows that 
//a user to create todos with his id 
app.post('/todos', authenticate, function (req, res) {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(function (document) {
        res.send(document);
    }).catch(function (err) {
       res.status(400).send(err);
    });
});

//----this gets/ fetches data from the database on the /todos route

//This allows only todos that have the particular user id 
//then returns it
app.get('/todos', authenticate, function (req, res) {
    Todo.find({
        _creator: req.user._id
    }).then(function (todos) {
        res.send({
            todos: todos
        });
    }, function (err) {
        res.status(400).send(err);
    });
});

//this gets/ fetches data from the database on the /todos route using the id parameter
app.get('/todos/:id', function (req, res) {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(400).send();
        }
        
        res.send({
            todo: todo
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

//this deletes/ removes documents from the database on the /todos route using the id parameter
app.delete('/todos/:id', authenticate, function (req, res) {
    let id =  req.params.id;
    
    //validating the id
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user.id
    }).then(function (doc) {
        if(!doc){
            res.status(404).send();
        }
        res.status(200).send({
            todo: doc
        });
    }).catch(function (err) {
        res.send(404).send();
    });
});

//Update todos
app.patch('/todos/:id', authenticate, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

     //validating the id
     if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user.id
    },
         {$set: body},
         {new: true})
         .then(function (todo) {
             if(!todo){
                 return res.status(404).send();
             }
             res.send({todo: todo});
         })
         .catch(function (err) {
             res.status(400).send();
         });
});

//Create new users and assigns tokens and access
app.post('/users', function (req, res) {
   let body = _.pick(req.body, ['email', 'password']);

   let user = new User({
        email: body.email,
        password: body.password
    });

    //save the user document to the database
   user.save().then(function () {
       //calls the generateAuthToken which generates
       //and saves the authentication token to the Database
       //and returns a promise which is the generated token
       return user.generateAuthToken();
   }).then(function (token) {
     res.header('x-auth', token).send(user);  
   }).catch(function (err) {
       res.status(400).send(err);
   });
});

//user login into the system
//trying out a private route
app.get('/users/me', authenticate, function (req, res) {
    res.send(req.user);
});

app.post('/users/login', function (req, res) {
    //We pick only the email and password as sent in the body of the request
    let body = _.pick(req.body, ['email', 'password']);
    
    //we find the email and hashed password that matches the that which is stored in the database
    User.findByCredentials(body.email, body.password).then(function (user) {
        //if user is found and crdentials matches, we generate a token for the user
        return user.generateAuthToken().then(function (token) {
            //set response custom header x-auth as generated token
            res.header('x-auth', token).send(user);
        });
    }).catch(function (err) {
        res.status(404).send();
    });
    
});


//This deletes the user token when user is logging off of the route below
app.delete('/users/me/token', authenticate, function (req, res) {
    req.user.removeToken(req.token).then(function () {
        res.status(200).send();
    }).catch(function () {
        res.status(400).send();
    });
});

app.listen(PORT, function () {
    console.log('Listening on port: ', PORT);
});

module.exports = {
    app: app
};