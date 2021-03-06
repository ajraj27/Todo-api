require('./config/config');
const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/Todo');
const {User}=require('./models/user');
const {authenticate}=require('./middleware/authenticate');


const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

app=express();
const port=process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',authenticate,async (req,res) => {
  try{
    const newTodo=new Todo({
      text:req.body.text,
      _creator:req.user._id
    });

    const doc=await newTodo.save();
    res.send(doc);
  }catch(e){
    res.status(400).send(e);
  }
});

app.get('/todos',authenticate,async (req,res) => {

  try{
    const todos=await Todo.find({_creator:req.user._id});
    res.send({todos});
  }catch(e){
    res.status(400).send(e);
  }
});

app.get('/todos/:id',authenticate,async(req,res) => {
  const id=req.params.id;
  const isValid=ObjectID.isValid(id);

  if(!isValid){
    return res.status(404).send();
  }

  try{
    const todo=await Todo.findOne({
      _id:id,
      _creator:req.user._id
    });

    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }catch(e){
    res.status(400).send();
  }

});

app.delete('/todos/:id',authenticate,async (req,res) => {
  const id=req.params.id;
  const isValid=ObjectID.isValid(id);

  if(!isValid){
    return res.status(404).res.send();
  }

  try{
    const todo=await Todo.findOneAndRemove({
      _id:id,
      _creator:req.user._id
    });

    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }catch(e){
    res.status(400).send();
  }
});

app.patch('/todos/:id',authenticate,async (req,res) => {
  const id=req.params.id;
  const body=_.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt=new Date().getTime();
  }else{
    body.completedAt=null;
    body.completed=false;
  }

  try{
    const todo=await Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true});
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});

  }catch(e){
    res.status(400).send();
  }
});

app.post('/users',async (req,res) => {

  try{
    const body=_.pick(req.body,['email','password']);
    const user=new User(body);
    await user.save();
    const token=await user.getAuthToken();
    res.header('x-auth',token).send(user);
  }catch(e){
    res.status(400).send(e);
  }
});


app.get('/users/me',authenticate,(req,res) => {

  res.send(req.user);
});

app.post('/users/login',async(req,res) => {

  try{
    const body=_.pick(req.body,['email','password']);
    const user=await User.findByCredentials(body.email,body.password);
    const token=await user.getAuthToken();
    res.header('x-auth',token).send(user);
  } catch(e){
    res.status(400).send();
  }

});

app.delete('/users/me/token',authenticate, async (req,res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    res.status(400).send();
  }
});

app.listen(port,() => {
  console.log('Started app');
});

module.exports={app};
