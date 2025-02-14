
const mongoose = require("mongoose");

const carttSchema = new mongoose.Schema({
    
  userid:{
      type:String,
      required:true
   },
    productname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    productimage:{
        type:String,
        required:true
    },
})

const cartModel = mongoose.model("cartModel",carttSchema);
module.exports = cartModel

