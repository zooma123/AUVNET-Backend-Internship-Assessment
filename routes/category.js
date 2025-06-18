const express = require('express') ;
const router = express.Router();
const { GetAllCategories ,  AddCategory , DeleteCategory , UpdateCategory} = require('../controllers/CategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')
router.get('/AllCategories' , GetAllCategories )
router.post('/AddCategory'  , AddCategory)
router.put('/UpdateCategory/:id',  UpdateCategory )
router.delete('/DeleteCategory/:id' , DeleteCategory )









module.exports = router