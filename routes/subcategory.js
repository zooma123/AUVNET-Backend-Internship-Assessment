const express = require('express') ;
const router = express.Router();
const { AddSubCategory ,GetAllSubCategories , UpdateSubCategory , deleteSubCategory} = require('../controllers/SubCategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')
 


router.get('/AllSubCategories' , GetAllSubCategories )
router.post('/AddSubCategory' ,  AddSubCategory)
 router.put('/UpdateSubCategory/:id',  UpdateSubCategory )
 router.delete('/DeleteSubCategory/:id' , deleteSubCategory )

module.exports = router;