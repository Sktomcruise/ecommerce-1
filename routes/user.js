const User = require("../models/User");
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken");

const router= require ("express").Router();

//update
router.put("/:id",verifyToken,async (req,res)=>{
    if(req.body.password){
         req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
         ).toString();
    }
    try{
     const updateUser= await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
     },{new:true}
     );
     res.status(200).json(updateUser);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//delete
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
      await User.findByIdAndDelete(req.params.id)
       return res.status(200).json("user has been deleted...")
    }catch(err){
        return res.status(500).json(err)
    }
})

//get user
router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
      const user=await User.findById(req.params.id);  
        res.status(200).json({user});
      
    }catch(err){
        return res.status(500).json(err)
    }
});

//get all user
router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    const query=req.query.new
    try{
      const users=query ? await User.find().sort({__id:1}).limit(1):await User.find();  
        res.status(200).json({users});
      
    }catch(err){
        return res.status(500).json(err);
    }
});


//get user stats
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date= new Date();
    const lastYear= new Date(date.setFullYear(date.getFullYear() - 1));

    try{
const data=await User.aggregate([
    { $match: {createdAt:{$gte:lastYear}}},
    {
        $project:{
            month:{$month:"$createdAt"},
        },
    },
    {
        $group:({
            _id:"$month",
            total:{$sum:1},
        }),
    },
]);
return res.status(200).json(data);
    }
    catch(err){
        return res.status(500).json(err);
    }
})


module.exports=router