const env = process.env.NODE_ENV || 'development';


if(env === 'development' || env === 'test'){
    const Config = require('./config.json');
    let envConfig = Config[env];

    Object.keys(envConfig).forEach(function (key) {
        process.env[key] = envConfig[key];
    });
};