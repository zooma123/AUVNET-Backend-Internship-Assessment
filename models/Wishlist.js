const mongoose = require  ("mongoose");

const wishlistSchema = new mongoose.Schema({
    user_id : {type : mongoose.Schema.Types.ObjectId , required :true,unique :true , ref : "user"},

    product_id : [{type : mongoose.Schema.Types.ObjectId ,required:true   , ref : "Product"}],

})



    

module.exports =  mongoose.model('WishList' , wishlistSchema);