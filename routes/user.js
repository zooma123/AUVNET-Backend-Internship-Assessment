const express = require('express') ;
const router = express.Router();
const  {  restrictTo , protect} = require ("./../controllers/AuthController.js") 
const {deleteUsersAndAdmins , ViewAdmins ,ViewUsers , updateAdmin , createAdmin } = require ("./../controllers/UserController.js")



router.get('/Admins' , protect,restrictTo("admin"),ViewAdmins) 
router.get('/Users' , protect ,restrictTo("admin") , ViewUsers) 
router.post('/AddAdmin' , protect ,restrictTo("admin") , createAdmin) 
router.put('/UpdateAdmin/:id' , protect ,restrictTo("admin") , updateAdmin) 
router.delete('/DeleteUsersandAdmins/:id' , protect, restrictTo('admin') ,  deleteUsersAndAdmins);



module.exports = router
