
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//creating a seed data that will be added into the database because
//the beforeEach function removes all documents from the database
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

//this should run before the set of test cases in the describe block
//What this should do is to delete all contents of the data base.
//this executes before any it() in program.
beforeEach(function (done) {
    Todo.remove({}).then(function () {
        return Todo.insertMany(todos);
    }).then(function () {
        done();
    });
});

//this is a test case that test POST method of the todos route
describe('POST /todos', function () {
    it('should create a new todo', function (done) {
        //our text variable to be used in place of text: "" as you know it
        let text = 'Test todo text';

        //calling the supertest method to begin a test
        request(app)
            //calling the post method from the supertest library
            .post('/todos')
            .send({text: text}) //this should send its content to the database, same as send() from express
            .expect(200) //expect a 200 status code
            .expect(function (res) {
                //expects the return value which is a response from the res.send() of the server in the server.js file
                expect(res.body.text).toBe(text); //response.body.text should be the same as the value of text
            })
            .end(function (err, res) { //this ends the test case for checking the post method and response from the database through the server if everything checks out correctly
                if(err){
                    return done(err); //if theres an error, from any expect case, then the function should end returning the done with the err object
                }
                //if no error, test should proceed to check the response from the server, if it corresponse with the result from the text variable
                Todo.find({
                    text: text
                }).then(function (todos) { //return a promise with all the documents from the todos database
                    expect(todos.length).toBe(1); //expects the results from the find() that gets all the documents from the database, which is supossed to be just 1
                    expect(todos[0].text).toBe(text); // expecting the return result which is an array with an object, accessing its text property to be same as text
                    done(); //ending the function which is supposed to be an asynchronous function. 
                }).catch(function (err) {
                    done(err); //if there is an error since its a promise, it calls the done with an err
                });
            });
    });

    it('should not create todo with invalid body data', function (done) {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end(function (err, res) {
                if(err){
                    return done(err);
                }

                Todo.find().then(function (todos) {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
    });
}
);

describe('GET /todos', function () {
    it('should get all todos', function (done) {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(function (res) {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', function () {
     it('should return todo doc',  function (done) {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(function (response) {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
     });

     it('should return 404 if todo is invalid', function (done) {
         let hexID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(400)
            .end(done);
     });
     
     it('should return 404 if todo not found', function (done) {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
     });
    });

    describe('DELETE /todos/:id', function () {
    it('should delete todo doc', function (done) {
        let hexID = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect(function (response) {
                expect(response.body.todo._id).toBe(hexID);
            })
            .end(function (err, res) {
                if(err){
                    return done(err);
                }

                Todo.findById(hexID).then(function (todo) {
                    expect(todo).toNotExist();
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
    });

    it('should return 404 if id is invalid', function (done) {
        let hexID = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found', function (done) {
        request(app)
            .delete('/todos/123')
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', function () {
    it('should update the todo', function (done) {
        let hexID = todos[0]._id.toHexString();
        let text = 'Testing Update as Patch';
        
        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text: text,
                completed: true
            })
            .expect(200)
            .expect(function (response) {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(function (err, res) {
                if(err){
                    done(err);
                }
                done();
            });
    });

    it('should clear completedAt when todo is not completed', function (done) {
        let hexID = todos[1]._id.toHexString();
        let text = 'Testing Update as Patch, Do you Believe';
        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text: text,
                completed: false
            })
            .expect(200)
            .expect(function (response) {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(function (err, res) {
                if(err){
                    done(err);
                }
                done();
            });
    });
});