const express = require('express') ;
const router = express.Router();
const { AddSubCategory ,GetAllSubCategories , UpdateSubCategory , deleteSubCategory} = require('../controllers/SubCategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')
 


router.get('/AllSubCategories' ,protect , GetAllSubCategories )
router.post('/AddSubCategory' ,  protect , restrictTo('admin') ,AddSubCategory)
 router.put('/UpdateSubCategory/:id', protect , restrictTo('admin') ,UpdateSubCategory )
 router.delete('/DeleteSubCategory/:id' , protect , restrictTo('admin') ,deleteSubCategory )

module.exports = router;