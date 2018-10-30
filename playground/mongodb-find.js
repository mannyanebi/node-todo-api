//requiring the mongodb client
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bcdcfdf4561c422700b7cb8')
    // }).toArray().then(function (docs) {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // })
    // .catch(function (err) {
    //     console.log('Unable to fetch todos', err)
    // })
    
    // db.collection('Todos').count().then(function (count) {
    //     console.log(`Number of items: ${count}`);
    // }).catch(function (err) {
    //     console.log('Unable to fetch todos', err);
    // })

    db.collection('Users').find({name:"Anebi"}).toArray().then(function (docs) {
        console.log(JSON.stringify(docs, null, 2));
    }).catch(function (err) {
        console.log('Unable to fetch todos', err);
    })

    // db.close();
});