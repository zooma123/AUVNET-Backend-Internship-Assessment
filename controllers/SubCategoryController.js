const Category = require('../models/Category');
const SubSubCategory = require('../models/Sub_Sub_Category');
const SubCategory = require('../models/SubCategory')
exports.GetAllSubCategories = async (req,res)=>{
try{

  const page = parseInt(req.query.page) || 1;       // Default to page 1
  const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
  const skip = (page - 1) * limit;


 const SubCategories = await SubCategory.find().
 populate('category_id' , 'Name').select('Name').skip(skip).limit(limit);
return res.status(200).json({
"message" : "success" ,
"Data" : SubCategories

})}catch(err){

res.status(404).json({
"error" : err.message

})
}
}




exports.AddSubCategory = async (req,res)=>{
    try{

// Here I will Prompt Admin To Add SubCategory By Category Name

        const  {category_id , Name} =  await  req.body
        if(!Name | !category_id){

            return res.status(404).json({
                "message" : "Please Provide The Name or id"
            })
        }
        

  await SubCategory.create({ category_id , Name});

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

    exports.deleteSubCategory = async (req, res) => {
        try {
          const subCategoryId = req.params.id;
      
          // 1. Check if subcategory exists
          const subCategory = await SubCategory.findById(subCategoryId);
          if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
          }
      
          // 2. Delete all related sub-sub-categories
          await SubSubCategory.deleteMany({ subCategory: subCategoryId });
      
          // 3. Delete the subcategory
          await SubCategory.findByIdAndDelete(subCategoryId);
      
          return res.status(200).json({
            message: "success"
          });
      
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
      



    
    
    


exports.UpdateSubCategory = async (req,res) => {
try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        req.params.id,
        { category_id : req.body.category_id, Name: req.body.Name }, {
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