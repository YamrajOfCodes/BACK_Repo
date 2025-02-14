const userDb = require("../../Model/user/userModel");
const cartDb = require("../../Model/Cart/cartSchema");
const cloudinary = require("../../cloudinary/cloudinary")
const bcrypt = require("bcryptjs")
const messageDb = require("../../Model/contact/contactModel");


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
        const { userid } = req.body;
        const cartData = await cartDb.findOne({userid:userid});

        res.status(200).json(cartData)
    } catch (error) {
        console.log(error);
        
    }
}

const deleteCart = async(req,res)=>{
    try {
        const { userid } = req.body;
        const cartData = await cartDb.deleteOne({userid:userid});

        res.status(200).json(cartData)
    } catch (error) {
        console.log(error);
        
    }
}


const message = async(req,res)=>{
    try {
        const {email,name,message} = req.body;

        if(!email || !name || !message){
            req.status(400).json({error:"all fields are required"})
        }else{
            const newmessage = new messageDb({
                email,name,message
            })

            await newmessage.save();
            res.status(200).json(newmessage)
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {Register,Login,userverify,logout,message,addtocart,getcart,deleteCart}