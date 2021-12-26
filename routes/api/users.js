var express = require('express');
var router = express.Router();
var User = require("../../models/User");
var bcryptjs = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { valid } = require('@hapi/joi');
const config = require("config");



router.post("/register" , async(req,res)=>{
let user = await User.findOne({email:req.body.email});
if(user){
return res.status(400).send("email already in use");
}
user = new User();
user.name = req.body.name;
user.email =  req.body.email;
user.password = req.body.password;
await user.generateHashedPassword();

await user.save();

return res.send(_.pick(user,["name","email"]));

})


router.post("/login" , async(req,res)=>{
  let user = await User.findOne({email:req.body.email});
  if(!user){
  return res.status(400).send("not a user");
  }

  let isvalid = await bcryptjs.compare(req.body.password,user.password  );
  if(!isvalid){
    return res.status(401).send("invalid pass");
  }
  let token = jwt.sign({_id: user._id, name: user.name}, config.get('jwtPrivatekey'));
  return res.send(token);

  

})




module.exports = router;
