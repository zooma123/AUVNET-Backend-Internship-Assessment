const express = require('express') ;
const router = express.Router();
const { AddSubSubCategory ,GetAllSubSubCategories , UpdateSubSubCategory , deleteSubSubCategory} = require('../controllers/Sub_Sub_CategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')
 


router.get('/AllSubSubCategories' , GetAllSubSubCategories )
router.post('/AddSubSubCategory' ,  AddSubSubCategory)
 router.put('/UpdateSubSubCategory/:id',  UpdateSubSubCategory )
 router.delete('/DeleteSubSubCategory/:id' , deleteSubSubCategory )

module.exports = router;