
const express = require('express') ;
const router = express.Router();
const { GetProductinWishList ,ClearWishList , addToWishList , deleteWishList , deleteProductWishList} = require('../controllers/WishListController')
const {restrictTo , protect} = require ('../controllers/AuthController')
router.get('/GetProductinWishList' , protect, GetProductinWishList )
router.post('/addToWishList' , protect , addToWishList)
router.delete('/deleteWishList/:id' , protect , deleteWishList )
router.delete('/deleteProductWishList' , protect , deleteProductWishList )
router.delete('/ClearWishList' , protect , ClearWishList) 


module.exports = router 