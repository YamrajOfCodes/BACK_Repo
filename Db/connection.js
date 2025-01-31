const mongoose=require("mongoose");

module.exports=async()=>{
    const dbUrl="mongodb+srv://kundan:9960322509@cluster0.k4tndq4.mongodb.net/hungryrats?retryWrites=true&w=majority&appName=Cluster0"     // make env file
    


    mongoose.connect(dbUrl,{
    }).then(()=>console.log("database connected")).catch((e)=>console.log("error",e))
    
}