// import SHA256 from crypto-js
const {SHA256} = require ('crypto-js');
const JWT = require('jsonwebtoken');

// let data = {
//     id: 5
// };

// let access = 'auth';

// let token = JWT.sign({
//     data: data,
//     access: access
// }, 'Yeshua');
// console.log(token);

let toke1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTJjNWI1MjFjMzk0MTcwMDJhYzVkMSIsImFjY2VzcyI6ImF1dGgiLCJpYXQiOjE1NDE1ODg0MDZ9.QmQoYojxJMMY-j8mfECm0ZobvU380VxiIq6MQi8Estw';

let decoded = JWT.verify(toke1, 'Yeshua');
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