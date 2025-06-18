const { response } = require("express");
const User = require ( "../models/User.js");



exports.deleteUsersAndAdmins = async(req,res) =>{
await User.findByIdAndDelete(req.params.id) ;
return res.status(200).json({

"message " : "success"

})


} 

exports.ViewAdmins = async(req,res) => {
admins = await User.find({role : "admin"  }).select('Username Email role ');


return res.status(200).json({

    "message " : "success" , 
    "data" : admins
    
    })


}

exports.ViewUsers = async(req,res) => {
    Users = await User.find({role : "user"  }).select('Username Email role ');
    
    
    return res.status(200).json({
    
        "message " : "success" , 
        "data" : Users
        
        })
    
    
    }
    
