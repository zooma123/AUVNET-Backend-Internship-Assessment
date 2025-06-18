const mongoose = require  ("mongoose");

const Sub_Sub_Category = new mongoose.Schema({
    subCategory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Category', required: true },
    Name: { type: String, required: true },
   
  });
  
  module.exports = mongoose.model('Sub_Sub_Category', Sub_Sub_Category);
  