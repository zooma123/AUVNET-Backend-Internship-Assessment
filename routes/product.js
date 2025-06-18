const express = require('express') ;
const router = express.Router();
const { CreateProduct ,GetAllProducts , UpdateProduct , DeleteProduct} = require('../controllers/ProductController')
const {restrictTo , protect} = require ('../controllers/AuthController')
const upload = require("../utils/multer.js");



router.get('/AllProducts' , GetAllProducts )
router.post('/AddProduct',  upload.single("image")  ,  CreateProduct)
 router.put('/UpdateProduct/:id',  UpdateProduct )
 router.delete('/DeleteProduct/:id' , DeleteProduct )

module.exports = router;