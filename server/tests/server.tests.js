const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/Todo');


const todos=[{
  _id:new ObjectID(),
  text:"First test todo"
},{
  _id:new ObjectID(),
  text:"Second test todo"
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => done());
});


describe('POST /todos',() => {

  it('should create a new todo', (done) => {
      const text='Random Todo';
      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
          if(err){
            return done(err);
          }

          Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((e) => done(e));
      });
  });

  it('should not create a new todo',(done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res) => {
      if(err){
        return done(err)
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all the todos',(done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    }).end(done);
  });
});


describe('GET /todos/:id',() => {
  it('should return the todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('should return 404 if todo not found',(done) => {
    const hexID=new ObjectID();

    request(app)
    .get(`/todos/${hexID}`)
    .expect(404)
    .end(done);

  });

  it('should return 404 for non-valid IDs',(done) => {

      request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id',() => {
  it('should update the todo doc',(done) => {
    const hexId=todos[0]._id.toHexString();
    const text='This should be new text';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed:true,
      text
    }).expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });

  it('should clear completedAt',(done) => {
    const hexId=todos[1]._id.toHexString();
    const text='This should be new text!!!!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed:false,
      text
    }).expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
