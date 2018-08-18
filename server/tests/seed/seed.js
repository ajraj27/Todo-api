const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/Todo');
const {User}=require('./../../models/user');
const jwt=require('jsonwebtoken');

const userOneID=new ObjectID();
const userTwoID=new ObjectID();

const users=[{
  _id:userOneID,
  email:'userone@example.com',
  password:'userOnePass',
  tokens:[{
    access:'auth',
    token: jwt.sign({_id:userOneID,access:'auth'},'123abc').toString()
  }]
},{
  _id:userTwoID,
  email:'usertwo@example.com',
  password:'userTwoPass'
}];

const todos=[{
  _id:new ObjectID(),
  text:"First test todo"
},{
  _id:new ObjectID(),
  text:"Second test todo"
}];



const populateTodos= (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => done());
};

const populateUsers= (done) => {
  User.remove({}).then(() => {
    const userOne=new User(users[0]).save();
    const userTwo=new User(users[1]).save();

    return Promise.all([userOne,userTwo])
  }).then(() => done());
}

module.exports={todos,populateTodos,users,populateUsers};
