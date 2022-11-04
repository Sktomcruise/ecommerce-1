const router= require ("express").Router();


const Order = require("../models/Order");
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken");


//create

router.post("/",verifyToken,async(req,res)=>{
    const newOrder=new Order(req.body)
    try{
        const savedOrder=await newOrder.save();
        return res.status(200).json(savedOrder);

    }catch(err){
        return res.status(500).json(err);
    }

})


//update
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    
    
    try{
     const updatedOrder= await Order.findByIdAndUpdate(req.params.id,{
        $set:req.body
     },{new:true}
     );
     res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//delete
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
      await Order.findByIdAndDelete(req.params.id)
       return res.status(200).json("Order has been deleted...")
    }catch(err){
        return res.status(500).json(err)
    }
})

//get user order
router.get("/find/:userId",verifyTokenAndAuthorization,async (req,res)=>{
    try{
      const orders=await Orders.find({userId:req.params.userId});  
        res.status(200).json({orders});
      
    }catch(err){
        return res.status(500).json(err)
    }
});

//get all oders

router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
const orders=await Orders.find()
return res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// get monthly income

router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
   const date=new Date();
   const lastMOnth= new Date(date.setMonth(date.getMonth()-1));
   const previousMOnth= new Date(new Date().setMonth(lastMOnth.getMonth()-1));

   try{
const income=await Order.aggregate([
   
    {$match:{createdAt:{$gte:previousMOnth}}},
    {
        $project:{
        month:{$month:"$createdAt"},
        sales:"$amount",
    },
},
    {
        $group:{
            _id:"$month",
            total:{$sum:"$sales"},
        },
    },
    
    
]);
return res.status(200).json(income);
   }
   catch(err){
res.status(500).json(err);
   }
});

module.exports=router;



