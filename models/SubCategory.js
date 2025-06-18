const mongoose = require  ("mongoose");

const Sub_CategorySchema = new mongoose.Schema({
    category_id : {type : mongoose.Schema.Types.ObjectId , ref : "category"},

    Name : {  type:String ,  required : [true, "Please Provide Sub_Category Name"]}, 

})



    

module.exports =  mongoose.model('Sub_Category' , Sub_CategorySchema);