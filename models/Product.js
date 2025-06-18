const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: {type :Number , required :true },
  subSubCategory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Sub_Category', required: true },
  description: String,
  image: String ,
  cloudinary_id: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);
