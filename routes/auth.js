const express = require('express') ;
const router = express.Router();
const  { register , login  , signOut , restrictTo , protect} = require ("./../controllers/AuthController.js") 


router.post('/SignUp' , register);
router.post('/SignIn' , login);









module.exports = router

