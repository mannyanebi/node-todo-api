//requiring the mongodb client
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    
    // db.collection('Todos').findOneAndDelete({completed: true}).then((result)=>{
    //     console.log(result);
    // });
    
    // db.collection('Users').deleteMany({name: 'Anebi'}).then(function (result) {
        //     console.log(result)
        // });
        
    db.collection('Users').findOneAndDelete({_id: new ObjectID("5bcdd09c6cc3091e98541e88")}).then((result)=>{
        console.log(result);
    });
    

    db.close();
});