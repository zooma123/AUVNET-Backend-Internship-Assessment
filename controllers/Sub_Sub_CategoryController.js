const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory')
const SubSubCategory = require('../models/Sub_Sub_Category');


exports.GetAllSubSubCategories = async (req,res)=>{
try{
    const subSubCategories = await SubSubCategory.find()
    .populate({
      path: 'subCategory_id',
      select: 'Name',
      populate: { path: 'category_id', select: 'Name' }
    })
    .select('Name');
return res.status(200).json({
"message" : "success" ,
"Data" : subSubCategories

})}catch(err){

res.status(404).json({
"error" : err.message

})
}
}




exports.AddSubSubCategory = async (req,res)=>{
    try{

// Here I will Prompt Admin To Add SubCategory By Category Name

        const  {NameOfSubCategory , Name} =  await  req.body
        if(!Name | !NameOfSubCategory){

            return res.status(404).json({
                "message" : "Please Provide The Name"
            })
        }
        
const SubCate= await SubCategory.findOne({ "Name" :NameOfSubCategory })
const  subCategory_id = SubCate._id


  await SubSubCategory.create({ subCategory_id , Name});

     return res.status(200).json({
     "message" : "success" ,
    
     })
}
catch(err){
    
    res.status(404).json({
    "error" : err.message
    
    })
    }
    }

    exports.deleteSubSubCategory = async (req, res) => {
        try {
          const SubSubCategoryId = req.params.id;
      
       
      
          // 3. Delete the subcategory
          await SubSubCategory.findByIdAndDelete(SubSubCategoryId);
      
          return res.status(200).json({
            message: " success"
          });
      
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
      



    
    
    


exports.UpdateSubSubCategory = async (req,res) => {
try {
    const updatedSubSubCategory = await SubSubCategory.findByIdAndUpdate(
        req.params.id,
        { Name: req.body.Name }, {
          new: true,           
          runValidators: true   
        }
      );

return res.status(200).json({
message : "success"

})

}catch(err){

return res.status(404).json({
"error" : err.message

})

}



}