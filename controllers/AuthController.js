const User = require ( "../models/User.js");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken") 
const { promisify } = require('util');


const signToken = (userId , role) => {
    return jwt.sign({ id: userId , role }, process.env.TOKEN_PASS, {
      expiresIn: "90d",
    });
  };

  const createSendToken = (user , statusCode , res)=>{
    const token = signToken(user._id, user.role)
    res.cookie('jwt' , token, { //Name Of The Cookie And Content
    expires : new Date(Date.now() + process.env.CookieExpire * 24 * 60 *60 * 1000), // Send Cookie to Client
    httpOnly : true // prevent Prowser From any Modification
    })
     
}


exports.register =  async (req,res) =>{
  
    const {Username,Email,password,role} = await  req.body
  
  const user =  await User.findOne({Username});
  
  
  if(user){
    return res.json({ status: 'error', error: 'User Already Exist' })
  }
  
  
  
  const hashedPassword = bcrypt.hashSync(password,10);
  
  try{
  
    const newUser = await User.create({Username,Email,password : hashedPassword , role })
    createSendToken(newUser , 201 , res);
  return res.status(200).json({
"message" : "success"

  })
   
  }catch(error){
  
    return res.status(401).json({ status: 'error', error: error.message})
  
  
  }
    
    
  }


  exports.login = async(req,res,next)=>{
    const {Username , password} = await req.body
    
    
    //Check if email and Password Exist
    if(!Username || !password){
      return res.json({ status: 'error', error: 'Invalid username/password' })
    
    }
    // Check if the User and Password Correct
    const user = await User.findOne({Username}).select('+password')
    
    if(!user ||!(await user.correctPassword(password , user.password)) ){
    return res.status(401).json({ status: 'error', error: 'Invalid username/password'})
    }
    
    const token = signToken(user._id , user.role)
    
    let oldTokens = user.tokens || [];
    
    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }
    await User.findByIdAndUpdate(user._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      });
      
      return res.json({ status: 'ok', data: token })
      };



//Check if The User Login In Or Not 
exports.protect = async (req, res, next) => {
    let token;
  
    //
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = await req.headers.authorization.split(' ')[1];
    }
  
    // 
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to get access."
      });
    }
  
    try {
      //  Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_PASS);
  
      // 4. Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          message: "The user belonging to this token no longer exists."
        });
      }
  
      // Attach user to request
      req.user = currentUser;
  
      //  Proceed to next middleware
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        error: err.message
      });
    }
  };



//Check The Role Of User 
      exports.restrictTo = (...roles) =>{
        
        return (req,res,next)=>{
         
        if(!roles.includes(req.user.role)){
         
        return res.status(403).json({
          message : "You Dont Have The permission To Do That Action"
        })
        
        }
        next();
        
        }
        
        
        }
        


    
        exports.SignOut = async (req, res) => {
          try{
        
            if (req.headers && req.headers.authorization) {
              const token = req.headers.authorization.split(' ')[1];
              if (!token) {
                return res
                  .status(401)
                  .json({ success: false, message: 'Authorization fail!' });
              }
          
              const tokens = req.user.tokens;
          
              const newTokens = tokens.filter(t => t.token !== token);
          
              await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
              res.json({ success: true, message: 'Sign out successfully!' });
          }}catch(err){
        
        res.status(400).json({
        message : err.message
        
        })
          
        
        
        
        
          }
          }
        
        
       