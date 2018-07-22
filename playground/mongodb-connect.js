const MongoClient=require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017',(err,client) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }

  const db=client.db('TodoApp');

  console.log('Successfully connected to mongodb server');

  db.collection('Todos').insertOne({
    text:'Something to do',
    done:false
  },(err,result) => {
    if(err){
      return console.log('Unable to add item to Todos collection',err);
    }

    //console.log(result.ops);
  });

  db.collection('Todos').insertOne({
    text:'Something to do now',
    done:false
  },(err,result) => {
    if(err){
      return console.log('Unable to add item to Todos collection',err);
    }

    console.log(result.ops[0]._id.getTimestamp());
  });

  client.close();
});
