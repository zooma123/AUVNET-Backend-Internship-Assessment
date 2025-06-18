const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/Sub_Sub_Category');
const Product = require('../models/Product.js')
const {cloudinary} = require('../utils/cloudinary.js')


exports.GetAllProducts = async (req,res)=>{
try{
 const Products = await Product.find().populate('subSubCategory_id' , 'Name');
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
    
    
    


exports.UpdateProduct = async (req,res) => {
try {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, req.body, {
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