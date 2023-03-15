const { render } = require('ejs');
var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const userModel = require("./users");

const jwt = require("jsonwebtoken");
const { token } = require('morgan');

// console.log(process.env.SECRET_KEY);

/* GET home page. */
router.get('/',async function(req, res, next) {

  const createToken = async() =>{
    const token = await jwt.sign({_id:"383778298shey73yb"},"annhaanhgsgsmhgshkhhdhddbh");
    console.log(token);
    const userVer = await jwt.verify(token,"annhaanhgsgsmhgshkhhdhddbh");
    console.log(userVer);
  }


  // createToken();
  res.render("login");
});


// register
router.get("/register",function(req,res){
  res.render("register");
})

router.post("/register",async function(req,res){
  const userData =await userModel.create({
    username:req.body.username,
    name:req.body.name,
    phone:req.body.phone,
    email:req.body.email,
    password:req.body.password,
  })
  // console.log(userData);
let token = await userData.getAuth();
  console.log("ttoken is "+token);

  res.cookie("jwt",token,{
    expires:new Date(Date.now()+600000),
    httpOnly: true
  });
  // console.log(cookie);
  res.redirect("/profile")
})


// login
router.get("/login",function(req,res){
  res.render("login");
})

router.post("/login",async function(req,res){
  try {
    const email = req.body.email;
    // console.log(email);
      const password = req.body.password;
      // console.log(password);
      const usermail = await userModel.findOne({email: email});
      // console.log(usermail.password);
      const isMatch = await bcrypt.compare(password,usermail.password);

      // token
      let token = await usermail.getAuth();
     console.log("ttoken is "+token);

    //  cookies
     res.cookie("jwt",token,{
      expires:new Date(Date.now()+600000),
      httpOnly: true
    });

      if(isMatch){
        res.redirect("/profile")
      }else{
        console.log("not match");
        res.render("login")
      }
  } catch (error) {
    console.log(error);
    res.render("login")
  }
})

router.get("/profile",auth,function(req,res){

  // console.log(`this is cokkis ${req.cookies.jwt}`);
  res.render("profile")
})

module.exports = router;
