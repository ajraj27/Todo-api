const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/Todo');
const {User}=require('./models/User');

const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

app=express();
const port=process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res) => {
  const newTodo=new Todo({
    text:req.body.text
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  })
});

app.get('/todos',(req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req,res) => {
  const id=req.params.id;

  const isValid=ObjectID.isValid(id);

  if(!isValid){
    return res.status(404).res.send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  },(e) => {
    res.status(400).send();
  });
});


app.listen(port,() => {
  console.log('Started app');
});

module.exports={app};
