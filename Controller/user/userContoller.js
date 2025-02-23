const userDb = require("../../Model/user/userModel");
const cartDb = require("../../Model/Cart/cartSchema");
const cloudinary = require("../../cloudinary/cloudinary")
const bcrypt = require("bcryptjs")
const messageDb = require("../../Model/contact/contactModel");
const SubscriptionDB = require("../../Model/Subscription/Subscription");
const axios = require("axios");

const Register = async(req,res)=>{
    try {
        const {Firstname,Lastname,email,mobile,password,confirmpassword,address} = req.body;

        console.log(req.body);
        

        if(!Firstname || !Lastname || !email || !password || !confirmpassword || !mobile){
            return res.status(400).json({error:"all fields are required"})
        }

        const userValid = await userDb.findOne({email});
        const mobilevalid = await userDb.findOne({mobile});

        if(userValid){
           return res.status(400).json({error:"User already exists"})
        }

        if(mobilevalid){
          return res.status(400).json({error:"mobile number is already an use"})
        }

        if(password !==confirmpassword){
            return res.status(400).json({error:"both passwords does not matched"})
        }else{

           const newuser = new userDb({
            Firstname,Lastname,email,password,mobile,address
           })

           await newuser.save();

           res.status(200).json(newuser)

        }
        
    } catch (error) {
        console.log(error);
    }

}


const Login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        console.log(req.body);
        

    
        if (!email || !password) {
            return res.status(400).json({ error: "Both fields are required" });
        }
    
        const validuser = await userDb.findOne({ email });
        if (!validuser) {
            return res.status(400).json({ error: "Please register first" });
        }
    
        const validpassword = await bcrypt.compare(password, validuser.password);
    
        if (!validpassword) {
            return res.status(400).json({ error: "Password is incorrect" });
        }
    
        const token = await validuser.generateToken();
        const result = {
            validuser,
            token
        };
    
        res.status(200).json(result);
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const userverify = async(req,res)=>{

    try {

       
        
        const validuser = await userDb.findOne({_id:req.userId});
       

        if(validuser){
            res.status(200).json([validuser,validuser])
        }else{
            res.status(400).json({error:"invalid admin"})
        }

    } catch (error) {
        console.log(error);
    }


}

const logout = async(req,res)=>{

    try {
        
        req.rootUser.tokens = req.rootUser.tokens.filter((element)=>{
            return element.token !== req.token
        })

        await req.rootUser.save();

        res.status(200).json("user is logout")

    } catch (error) {
        
    }

}

const addtocart = async(req,res)=>{
    try {
       const { userid, productname , price , productimage} = req.body;
       console.log(req.body);
       
       
       if(!userid, !productname, !price , !productimage){
        return res.status(400).json({error:"All the fields are required"});
       }

       const CheckCart = await cartDb.findOne({userid:userid})

       if(CheckCart){
        await cartDb.deleteOne({userid:userid})
       }

       const Cart =  new cartDb({
        userid,
        productname,
        productimage,
        price,
       })

       await Cart.save();
       res.status(200).json(Cart);

    } catch (error) {
        console.log(error);
        
    }
}

const getcart = async(req,res)=>{
    try {
        const { userid } = req.params;
        console.log(userid);
        
        const cartData = await cartDb.findOne({userid:userid});

        res.status(200).json(cartData)
    } catch (error) {
        console.log(error);
        
    }
}

const deleteCart = async(req,res)=>{
    try {
        const { userid } = req.params;
        const cartData = await cartDb.deleteOne({_id:userid});

        res.status(200).json(cartData)
    } catch (error) {
        console.log(error);
        
    }
}


const message = async(req,res)=>{
    try {
        const {email,name,message,subject} = req.body;

        if(!email || !name || !message || !subject){
            req.status(400).json({error:"all fields are required"})
        }else{
            const newmessage = new messageDb({
                email,name,message,subject
            })

            await newmessage.save();
            res.status(200).json(newmessage)
        }
    } catch (error) {
        console.log(error);
    }
}

const CheckSubscription = async(req,res)=>{
    try {
    
        const {userid} = req.params;
        console.log(userid);
        
      
        const subscription = await SubscriptionDB.findOne({userid});

        console.log(subscription);
        

        if(!subscription){
            return res.status(400).json("Not Subscribed");
        }
        
        return res.status(200).json("Already subscribed");

        
    } catch (error) {
        console.log(error);
        
    }
}

const Subscribe = async(req,res)=>{
    try {
      const {userid,username,days} = req.body;

        if(!userid || !username || !days){
            return res.status(400).json({error:"all fields are required"});
        }


       const newSubscriber = new SubscriptionDB({
         userid,username,days
       })

       await newSubscriber.save()

       res.status(200).json("Subscribe Successfully");

    } catch (error) {
        console.log(error);
        
    }
}

const CreatePayment = async(req,res)=>{
    console.log("Incoming request:", req.body); // Debugging

    try {
        const apiUrl = 'https://pay0.shop/api/create-order';
        const response = await axios.post(apiUrl, new URLSearchParams(req.body).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log("API Response:", response.data); // Debugging
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {Register,Login,userverify,logout,message,addtocart,getcart,deleteCart,CheckSubscription,Subscribe,CreatePayment}