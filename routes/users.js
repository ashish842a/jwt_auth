
require('dotenv').config()
const mongoose = require("mongoose")
// const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/jwtDatabase")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema({
  key:{
    type:Number,
    default:0
  },
  name:String,
  username:String,
  phone:String,
  email:String,
  password:String,

  tokens:[{
    token:{
      type: String,
      required: true
    }
  }]
 
})

userSchema.methods.getAuth = async function(){
  try {
    console.log(this._id);
    let token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    // console.log(token);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token
  } catch (error) {
    resizeBy.send("this is erow ");
    console.log(error);
  }
}

userSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);

  }
  next();
})



// userSchema.plugin(plm)
module.exports = mongoose.model("user",userSchema)