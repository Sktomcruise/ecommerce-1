const router= require ("express").Router();


const Cart = require("../models/Cart");
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken");


//create

router.post("/",verifyToken,async(req,res)=>{
    const newCart=new Products(req.body)

    try{
        const savedCart=await newCart.save();
        return res.status(200).json(savedCart);

    }catch(err){
        return res.status(500).json(err);
    }

})


//update
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    
    
    try{
     const updatedCart= await Cart.findByIdAndUpdate(req.params.id,{
        $set:req.body
     },{new:true}
     );
     res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//delete
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
      await Cart.findByIdAndDelete(req.params.id)
       return res.status(200).json("cart has been deleted...")
    }catch(err){
        return res.status(500).json(err)
    }
})

//get user cart
router.get("/find/:userId",verifyTokenAndAuthorization,async (req,res)=>{
    try{
      const cart=await Cart.findOne({userId:req.params.userId});  
        res.status(200).json({cart});
      
    }catch(err){
        return res.status(500).json(err)
    }
});

//get all products

router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
const carts=await Cart.find()
return res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports=router;



