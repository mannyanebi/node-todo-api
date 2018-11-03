// import SHA256 from crypto-js
const {SHA256} = require ('crypto-js');
const JWT = require('jsonwebtoken');

let data = {
    id: 5
};

let token = JWT.sign(data, 'Yeshua');
console.log(token);

let decoded = JWT.verify(token, 'Yeshua_a');
console.log(decoded);

// let message = 'I am user number 3';
// let hash = SHA256(message + 'Yeshua').toString();

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// let data = {
//     id: 5
// };

// let token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'Yeshua').toString()
// };

// let resultHash = SHA256(JSON.stringify(token.data) + 'Yeshua').toString();

// if(token.hash === resultHash){
//     console.log('Data was not changed');
// } else{
//     console.log('Data was changed, Don\'t trust');
// }