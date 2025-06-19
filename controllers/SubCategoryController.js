const Category = require('../models/Category');
const SubSubCategory = require('../models/Sub_Sub_Category');
const SubCategory = require('../models/SubCategory')
exports.GetAllSubCategories = async (req,res)=>{
try{
 const SubCategories = await SubCategory.find().populate('category_id' , 'Name').select('Name');
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

        const  {NameOfCategory , Name} =  await  req.body
        if(!Name | !NameOfCategory){

            return res.status(404).json({
                "message" : "Please Provide The Name"
            })
        }
        
const category = await Category.findOne({ "Name" :NameOfCategory })
const category_id = category._id
console.log(category_id)

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