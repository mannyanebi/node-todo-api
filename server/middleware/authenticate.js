const {User} = require('../models/user');

//middleware for private  request route;
var authenticate = function (req, res, next) {
    let token = req.header('x-auth');

    User.findByToken(token).then(function (user) {
       if(!user) {
        //    return new Promise(function (resolve, reject) {
        //        reject('No such user found');
        //    });
        //Better and simpler code
        return Promise.reject('No such user FOUND!');
       }

       req.user = user;
       req.token = token;
       next();
    }).catch(function (err) {
        res.status(401).send(err);
    });
};

module.exports = {
    authenticate: authenticate
};