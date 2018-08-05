const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

// const data={
//   id:10
// }
//
// const token=jwt.sign(data,'123abc');
// console.log(token);
//
// const decoded=jwt.verify(token,'123abc');
// console.log('Decoded',decoded);

const password='123abc';

bcrypt.genSalt(10,(err,salt) => {
  bcrypt.hash(password,salt,(err,hash) => {
    console.log(hash);
  })
})
