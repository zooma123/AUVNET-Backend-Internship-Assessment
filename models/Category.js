const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    Name : {  type:String ,  required : [true, "Please Provide Category Name"]}, 

})



    

module.exports =  mongoose.model('category' , categorySchema);