const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userid:{
        type:String,
        reuqired:true
    },
    username:{
        type:String,
        reuqired:true
    },
    days:{
        type:Number,
        reuqired:true
    },
}) 

const SubscriptionModel = mongoose.model("subscriptionModel",SubscriptionSchema);
module.exports = SubscriptionModel