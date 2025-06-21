const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/Sub_Sub_Category');
const Product = require('../models/Product.js')
const {cloudinary} = require('../utils/cloudinary.js')


exports.GetAllProducts = async (req,res)=>{
try{

    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
    const skip = (page - 1) * limit;


 const Products = await Product.find().populate('subSubCategory_id' , 'Name').skip(skip).limit(limit);
return res.status(200).json({
"message" : "success" ,
"Data" : Products

})}catch(err){

res.status(404).json({
"error" : err.message

})
}
}




exports.CreateProduct= async (req,res)=>{
    try{
    
        const {name , price , quantity , SubSubCategoryName,description } = await req.body
        const result = await cloudinary.uploader.upload(req.file.path);
        const subSubCategory_id =  await SubSubCategory.findOne({'Name' : SubSubCategoryName}) ;
await Product.create({
"name" : name ,
"price" : price,
"quantity" : quantity ,
"subSubCategory_id" :subSubCategory_id,
"description" : description,
"image": result.secure_url,
"cloudinary_id"  : result.public_id,

})


    

   
    return res.status(200).json({
    "message" : "success" ,
    
    })}catch(err){
    
    res.status(404).json({
    "error" : err.message
    
    })
    }
    }


exports.DeleteProduct = async (req,res)=>{
try{
    const product = await req.params.id




 DeletedProduct = await Product.findByIdAndDelete(product);
 return res.status(200).json({
     "message" : "success" ,
     
     })
}catch(err){

    res.status(404).json({
        "error" : err.message
        
        })

}



}
    
    
    

exports.UpdateProduct = async (req, res) => {
    try {
      const { name, price, quantity, SubSubCategoryName, description } = req.body;
      
      // Check if product exists
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({
          message: "error",
          error: "Product not found"
        });
      }
  
      // Find the SubSubCategory
      const subSubCategory_id = await SubSubCategory.findOne({ 'Name': SubSubCategoryName });
      if (!subSubCategory_id) {
        return res.status(404).json({
          message: "error",
          error: "SubSubCategory not found"
        });
      }
  
      // Prepare update data
      let updateData = {
        name,
        price,
        quantity,
        subSubCategory_id,
        description
      };
  
      // Handle image update if new image is provided
      if (req.file) {
        // Delete old image from cloudinary if it exists
        if (existingProduct.cloudinary_id) {
          await cloudinary.uploader.destroy(existingProduct.cloudinary_id);
        }
        
        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path);
        updateData.image = result.secure_url;
        updateData.cloudinary_id = result.public_id;
      }
  
      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );
  
      return res.status(200).json({
        message: "success",
        Data: updatedProduct
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "error",
        error: err.message
      });
    }
  }