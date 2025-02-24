const productDb = require("../../Model/product/productModel");
const cloudinary = require("../../cloudinary/cloudinary");
const orderDb = require("../../Model/Order/orderModel");
const SubscribeDB = require("../../Model/Subscription/Subscription");
const { subscribe } = require("../../Routes/user/userRoutes");

const addproduct = async(req,res)=>{

const {productname,price,subprice,description,rating} = req.body;
try {
  console.log(productname,price,description,subprice,rating);

     if(!productname || !price || !description || !subprice || !rating){
       return res.status(400).json({error:"all the fields are required"})
     }

     const productExist = await productDb.findOne({productname:productname});

     if(productExist){
       res.status(400).json({error:"product are already exists"})
     }else{
       const file = req.file?.path;
       const uploads = await cloudinary.uploader.upload(file);

       const Product = new productDb({
        productname,price,description,subprice,rating,productimage:uploads.secure_url
       })

       await Product.save();

       res.status(200).json(Product);
     }

} catch (error) {
    console.log(error);
}

}

const getproduct = async(req,res)=>{

try {
    
    const getallproducts = await productDb.find({});
    res.status(200).json(getallproducts)

} catch (error) {
    console.log(error);
}


}


const getsingleproduct = async(req,res)=>{

 const {productId} = req.params

 try {
    
   const getproduct = await productDb.findById({_id:productId});
   res.status(200).json(getproduct)

 } catch (error) {
    console.log(error);
 }

}


const deleteproduct = async(req,res)=>{

  const {productId}  = req.params;

    try {
        const deleteproduct = await productDb.findByIdAndDelete({_id:productId});
        res.status(200).json(deleteproduct)
    } catch (error) {
    console.log(error);    
    }

}

const orders = async(req,res)=>{

  try {
    const {Firstname,mobile,productname,price} = req.body;

    const {userid} = req.params;
  console.log(userid);
  





  

    if(!Firstname || !mobile || !price || !productname){
     return res.status(400).json({error:"please wait few seconds "});
    }

    const neworder = await orderDb.findOne({Firstname:Firstname})
    const order = await orderDb.findOne({productname:productname,Firstname:Firstname});
    if(order){
     return res.status(400).json({error:"please wait to deliver"})
    }else if(neworder){
         return res.status(400).json({error:`you already placed another order`});
    }else{

     const Subscirbe = await SubscribeDB.findOne({userid:userid});
    //  console.log("reach")
    //  console.log(Subscirbe);
     

     if(Subscirbe){
      // console.log(Subscirbe.days);
      
      if(Subscirbe.days > 0){

       Subscirbe.days = Subscirbe.days - 1;
       await Subscirbe.save();

        const neworder = new orderDb({
          Firstname,
          price,
          mobile,
          productname
        })
  
        await neworder.save();
        res.status(200).json("order is placed")
      }else{
        // console.log("hi");
        
       res.status(400).json({error:"Your Subscription is out of date"});
      }
 
      }
     }

    

  } catch (error) {
    console.log(error);
  }

}

const getallorders = async(req,res)=>{
   try {
     const orders = await orderDb.find({});
     res.status(200).json(orders)
   } catch (error) {
    console.log(error);
   }
}

const deleteorders = async (req,res)=>{
  const {orderId} = req.params;
  try {
    const deleteOrder = await orderDb.findOneAndDelete({_id:orderId});
    res.status(200).json(deleteOrder)
  } catch (error) {
    console.log(error);
  }
}


module.exports = {addproduct,getproduct,getsingleproduct,deleteproduct,orders,getallorders,deleteorders}