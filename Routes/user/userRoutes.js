const Router = require("express").Router();
const userController = require("../../Controller/user/userContoller");
const userauthenticate = require("../../middleware/user/userAuthenticate");

Router.post("/register",userController.Register);
Router.post("/login",userController.Login);

Router.get("/userverify",userauthenticate,userController.userverify);
Router.post("/logout",userauthenticate,userController.logout)

Router.post("/message",userController.message);





// Cart

Router.post("/addcart",userController.addtocart);
Router.get("/getcart",userController.getcart);
Router.delete("/deletecart",userController.deleteCart);











module.exports = Router