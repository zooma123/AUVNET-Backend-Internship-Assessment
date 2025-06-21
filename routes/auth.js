const express = require('express') ;
const router = express.Router();
const  { register , login  , SignOut , restrictTo , protect} = require ("./../controllers/AuthController.js"); 

router.post('/SignUp' , register);
router.post('/SignIn' , login);
 router.post('/SignOut' ,protect, SignOut)








module.exports = router

