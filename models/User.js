const mongoose = require  ("mongoose");
const validator = require ('validator')
const bcrypt =  require  ('bcryptjs')

const userSchema = new mongoose.Schema({
    Username : {  type:String ,  required : [true, "Please Tell Us Your Name"]}, 
    Email : { type: String ,  required : [true , "Please Provide Your Email"]
,unique : true ,
lowercase :true ,
validate : [validator.isEmail, 'please Provide a valid email'] } ,
password: {type :String ,required: [true , 'Please provide a Password'] , select :false},
role: {type : String , enum:["user" , "admin"] , default: "user" } , 
tokens : [{type : Object}]

})


userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
    
    }
    

module.exports =  mongoose.model('user' , userSchema);