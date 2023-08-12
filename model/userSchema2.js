const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema2 = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  applyingfor: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens:[
        {
          token:{
            type: String,
            required: true
          }
        }
    ]
});

userSchema2.pre('save', async function(next){
    if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password, 12);
      this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

userSchema2.methods.generateAuthToken = async function() {
    try{
    let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
    }catch(err){
    console.log(err);
      }
    }

const User2 = mongoose.model("student", userSchema2);

module.exports = User2;
