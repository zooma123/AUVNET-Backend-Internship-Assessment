const User = require('../models/User')
const WishList = require('../models/Wishlist');



exports.GetProductinWishList = async (req,res)=>{
try{
  const page = parseInt(req.query.page) || 1;       // Default to page 1
  const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
  const skip = (page - 1) * limit;

    const userid = req.user._id
    const wishlist = await  WishList.findOne({"user_id" : userid  });
    if (!wishlist) {
        return res.status(404).json({ message: 'your Wishlist is empty' });
      }
console.log(wishlist)      
    const products =  await wishlist.populate("product_id" )
return res.status(200).json({
"message" : "success" ,
"Data" : products

})}catch(err){

res.status(404).json({
"error" : err.message

})
}
}





    exports.addToWishList = async (req, res) => {
        const userId = req.user._id; 
        const { productId } = req.body;
      
        try {
          let wishList = await WishList.findOne({ user_id: userId });
      
          if (!wishList) {
            wishList = await WishList.create({ user_id: userId, product_id: [productId] });
          } else {

            // Check if product already exists
            if (wishList.product_id.includes(productId)) {
              return res.status(400).json({ message: 'Product already in wishlist' });
            }
      
            // Add product and save
            wishList.product_id.push(productId);
            await wishList.save();
          }
      
          res.status(200).json({ message: 'success'});
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      };
    

    exports.deleteWishList = async (req, res) => {
        try {
          const WishList_ID = req.params.id;
      
          
          await WishList.findByIdAndDelete(WishList_ID);
      
          return res.status(200).json({
            message: " success"
          });
      
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
      




      exports.deleteProductWishList = async (req, res) => {
        try {
            const userid = req.user._id
            const wishlist = await WishList.findOne({"user_id" : userid  });
      const productId =  req.body.productId

      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

          if(!wishlist.product_id.includes(productId)){
            return res.status(404).json({
                message: " Not Found"
              });
          

          }

          await WishList.updateOne(
            { user_id: userid },
            { $pull: { product_id: productId } }
          );

          return res.status(200).json({
            message: " success"
          });
      
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
    
    

      
      exports.ClearWishList = async (req, res) => {
        try {
            const userid = req.user._id
            const wishlist = await WishList.findOne({"user_id" : userid  });
  

      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      wishlist.product_id = []; // Clear all products
      await wishlist.save();        

          return res.status(200).json({
            message: "success"
          });
      
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
    
    

      
    



