const express = require('express') ;
const router = express.Router();
const { GetAllCategories ,  AddCategory , DeleteCategory , UpdateCategory} = require('../controllers/CategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')



router.get('/AllCategories' , protect , GetAllCategories )
router.post('/AddCategory'  , protect , restrictTo('admin') , AddCategory)
router.put('/UpdateCategory/:id', protect , restrictTo('admin') ,UpdateCategory )
router.delete('/DeleteCategory/:id' ,  protect , restrictTo('admin'), DeleteCategory )









module.exports = router