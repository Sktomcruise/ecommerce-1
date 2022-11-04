const router = require("express").Router();
const express= require("express");
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt=require("jsonwebtoken");
const path=require("path");
const app=express();



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');



router.get("/login",(req,res)=>{
    res.render("login.ejs")
})

router.get("/register",(req,res)=>{
    res.render("register.ejs")
})

//register
router.post("/register", async (req, res) => {
  
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
        ).toString(),

    });

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser)
        console.log(savedUser);
    } catch (err) {
        res.status(500).json(err)
    }
});

//login

router.post("/login",async (req, res) => {
    
    try{
        const user=await User.findOne({username:req.body.username});
        if(!user){ 
             return res.status(401).json("wrong credentials");
    }
       

        const hashedpassword=CryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_SECRET
        );
        const Originalpassword=hashedpassword.toString(CryptoJs.enc.Utf8);
        const accessToken =jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
         },process.env.JWT_SEC,
         {expiresIn:"7d"}
         )
               
       if( Originalpassword !==req.body.password){
         return res.status(401).json("wrong credentional");
        }
         
else{
        return res.status(200).json({user,accessToken});
        }
        
      
    }catch(err){
        return res.status(500).json(err);

    }

});








module.exports = router