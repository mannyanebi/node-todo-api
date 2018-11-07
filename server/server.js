const env = process.env.NODE_ENV || 'development';

console.log('ENV **********',  env);
if (env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
     
}

//library imports
const _ = require('lodash');
const express = require('express');
const BodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local requirements
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = ('./middleware/authenticate');

var app = express();
const PORT =  process.env.PORT;
// const PORT =  process.env.PORT || 3000;

app.use(BodyParser.json());

//this sends todo data to the database 
//creating a new todo with only a text property
app.post('/todos', function (req, res) {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(function (document) {
        res.send(document);
    }).catch(function (err) {
       res.status(400).send(err);
    });
});

//this gets/ fetches data from the database on the /todos route
app.get('/todos', function (req, res) {
    Todo.find().then(function (todos) {
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
app.delete('/todos/:id', function (req, res) {
    let id =  req.params.id;
    
    //validating the id
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    Todo.findByIdAndRemove(id).then(function (doc) {
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
app.patch('/todos/:id', function (req, res) {
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
    
    Todo.findByIdAndUpdate(id,
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


//trying out a private route
app.get('/users/me', authenticate, function (req, res) {
    res.send(req.user);
});

app.listen(PORT, function () {
    console.log('Listening on port: ', PORT);
});

module.exports = {
    app: app
};