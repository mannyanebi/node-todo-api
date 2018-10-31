//requiring the mongodb client
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5bd7063b82b2b487feea1da7")
    // },{
    //     $set: {
    //         text: 'I just updated this'
    //     }
    // },{
    //     returnOriginal: false
    // }).then(function (result) {
    //     console.log(result);
    // });

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5bd7063b82b2b487feea1da7")
    }, {
        $set: {
            text: 'Fuu-Shinkafa'
        },

        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then(function (result) {
        console.log(result);
    });

    db.close();
});