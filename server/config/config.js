const env = process.env.NODE_ENV || 'development';


// if(process.env.TESTPERMIT == 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    
// } else{
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }

// console.log('ENV **********',  env);
// if (env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';     
// }

if(env === 'development' || env === 'test'){
    const Config = require('./config.json');
    let envConfig = Config[env];

    Object.keys(envConfig).forEach(function (key) {
        process.env[key] = envConfig[key];
    });
};