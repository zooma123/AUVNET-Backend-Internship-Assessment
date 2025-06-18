const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dnjp8ngl5",
  api_key: "513255213868893",
  api_secret: "XZnKjX6EHKXP91qnfnh_J0s_FA0"
});



module.exports = {cloudinary}