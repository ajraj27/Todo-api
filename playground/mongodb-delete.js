const MongoClient=require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017',(err,client) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }

  const db=client.db('TodoApp');

  console.log('Successfully connected to mongodb server');

  db.collection('Todos').findOneAndDelete({done:true}).then((result) => {
    console.log(result);
  })


  //client.close();
});
