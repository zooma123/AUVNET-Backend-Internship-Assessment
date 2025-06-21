const User = require ( "../models/User.js");
const bcrypt = require('bcrypt');





exports.createAdmin = async (req, res) => {
    try {
      const { Username, Email, password } = req.body;
  
      // check if user exists
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
  
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new User({
        Username,
        Email,
        password: hashedPassword,
        role: 'admin'
      });
  
      await newAdmin.save();
  
      return res.status(201).json({ message: "success", admin: newAdmin });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };



exports.deleteUsersAndAdmins = async(req,res) =>{
await User.findByIdAndDelete(req.params.id) ;
return res.status(200).json({

"message " : "success"

})


} 



exports.updateAdmin = async (req, res) => {
    try {
      const  id  = req.params.id; 
      const updates = req.body;
  
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      const updatedAdmin = await User.findOneAndUpdate(
        { _id: id, role: 'admin' },
        updates,
        { new: true }
      );
  
      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      return res.status(200).json({ message: "success", admin: updatedAdmin });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

exports.ViewAdmins = async(req,res) => {

    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
    const skip = (page - 1) * limit;

admins = await User.find({role : "admin"  }).select('Username Email role ').skip(skip).limit(limit);


return res.status(200).json({

    "message " : "success" , 
    "data" : admins
    
    })


}

exports.ViewUsers = async(req,res) => {


    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
    const skip = (page - 1) * limit;


   const  Users = await User.find({role : "user"  }).select('Username Email role ').skip(skip).limit(limit);
    
    
    return res.status(200).json({
    
        "message " : "success" , 
        "data" : Users
        
        })
    
    
    }
    


