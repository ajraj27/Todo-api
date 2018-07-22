const mongoose=require('mongoose');

const User=mongoose.connect('User',{

  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1
  }
});

module.exports={User};
