const express = require('express') ;
const router = express.Router();
const { AddSubSubCategory ,GetAllSubSubCategories , UpdateSubSubCategory , deleteSubSubCategory} = require('../controllers/Sub_Sub_CategoryController')
const {restrictTo , protect} = require ('../controllers/AuthController')
 


router.get('/AllSubSubCategories' , protect,GetAllSubSubCategories )
router.post('/AddSubSubCategory' ,  protect , restrictTo('admin') ,AddSubSubCategory)
 router.put('/UpdateSubSubCategory/:id',   protect , restrictTo('admin'),UpdateSubSubCategory )
 router.delete('/DeleteSubSubCategory/:id' ,  protect , restrictTo('admin') ,deleteSubSubCategory )

module.exports = router;