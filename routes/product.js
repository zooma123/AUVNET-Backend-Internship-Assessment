const express = require('express') ;
const router = express.Router();
const { CreateProduct ,GetAllProducts , UpdateProduct , DeleteProduct} = require('../controllers/ProductController')
const {restrictTo , protect} = require ('../controllers/AuthController')
const upload = require("../utils/multer.js");



router.get('/AllProducts' , protect ,GetAllProducts )
router.post('/AddProduct', protect , restrictTo('admin') , upload.single("image")  ,  CreateProduct)
 router.put('/UpdateProduct/:id', protect , restrictTo('admin'),upload.single("image") , UpdateProduct )
 router.delete('/DeleteProduct/:id' ,protect , restrictTo('admin') ,DeleteProduct )

module.exports = router;