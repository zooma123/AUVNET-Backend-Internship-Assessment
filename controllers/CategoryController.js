const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/Sub_Sub_Category');

exports.GetAllCategories = async (req,res)=>{
try{
    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
    const skip = (page - 1) * limit;

 const Categories = await Category.find().skip(skip).limit(limit);
return res.status(200).json({
"message" : "success" ,
"Data" : Categories

})}catch(err){

res.status(404).json({
"error" : err.message

})
}
}




exports.AddCategory = async (req,res)=>{
    try{
        const Name = req.body.Name
        if(!Name){

            return res.status(404).json({
                "message" : "Please Provide The Name"
            })
        }

   const category = await Category.create({Name});

    return res.status(200).json({
    "message" : "success" ,
    
    })}catch(err){
    
    res.status(404).json({
    "error" : err.message
    
    })
    }
    }


exports.DeleteCategory = async (req,res)=>{
try{
    const category = await req.params.id


//DeleteRelated SubCategory and -Sub-subCategory

 // Get all subcategories under this category
 const subCategories = await SubCategory.find({ category_id: category });

 // Get all subcategory IDs
 const subCategoryIds = subCategories.map(sub => sub._id);

 // Delete sub-subcategories
 await SubSubCategory.deleteMany({ subCategory: { $in: subCategoryIds } });

 // Delete subcategories
 await SubCategory.deleteMany({ category_id: category })

 DeletedCategory = await Category.findByIdAndDelete(category);
 return res.status(200).json({
     "message" : "success" ,
     
     })
}catch(err){

    res.status(404).json({
        "error" : err.message
        
        })

}



}
    
    
    


exports.UpdateCategory = async (req,res) => {
try {
    const updatedCategory = await Category.findByIdAndUpdate(
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