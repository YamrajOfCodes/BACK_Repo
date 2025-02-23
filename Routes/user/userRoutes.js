const Router = require("express").Router();
const { json } = require("express");
const userController = require("../../Controller/user/userContoller");
const userauthenticate = require("../../middleware/user/userAuthenticate");

Router.post("/register",userController.Register);
Router.post("/login",userController.Login);

Router.get("/userverify",userauthenticate,userController.userverify);
Router.post("/logout",userauthenticate,userController.logout)

Router.post("/message",userController.message);




// subscription model

Router.get("/subscription/:userid",userController.CheckSubscription);
Router.post("/subscribe",userController.Subscribe);

// Payment
Router.post("/payment",userController.CreatePayment);



// Cart

Router.post("/addcart",userController.addtocart);
Router.get("/getcart/:userid",userController.getcart);
Router.delete("/deletecart/:userid",userController.deleteCart);











module.exports = Router