const express = require('express') ;
const router = express.Router();
const  { register , login  , signOut , restrictTo , protect} = require ("./../controllers/AuthController.js") 
const {deleteUsersAndAdmins , ViewAdmins ,ViewUsers} = require ("./../controllers/UserController.js")



router.get('/Admins' , protect,restrictTo("admin"),ViewAdmins) 
router.get('/Users' , protect ,restrictTo("admin") , ViewUsers) 
router.delete('/DeleteUsersandAdmins/:id' , protect, restrictTo('admin') ,  deleteUsersAndAdmins);



module.exports = router
