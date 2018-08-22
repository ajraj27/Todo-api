const mongoose=require('mongoose');

const Todo=mongoose.model('Todo',{
  text:{
    type:String,
    required:true,
    trim:true,
    minlength:1
  },

  completed:{
    type:Boolean,
    default:false
  },

  completedAt:{
    type:Number,
    default:null
  },

  _creator:{
    reuqired:true,
    type:mongoose.Schema.Types.ObjectId
  }
},'Todos');

module.exports={Todo};
