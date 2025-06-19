const express = require("express");
const  mongoose = require("mongoose");
const url = require("url");
const app = express();
const  cors = require ("cors") ;
const  dotenv = require ('dotenv') ;    
const cookieParser = require('cookie-parser')
const auth = require ("./routes/auth.js");
const user = require ("./routes/user.js");
const category = require("./routes/category.js")
const subcategory = require("./routes/subcategory.js")
const subsubcategory= require("./routes/subsubcategory.js")
const product = require("./routes/product.js")
const wishlist = require("./routes/wishlist.js")


app.use(cors());
dotenv.config();
const { createServer } = require('node:http');
 const server = createServer(app);

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended :true}))

app.use("/auth" , auth);
app.use("/user" , user);
app.use("/category" ,category )
app.use("/subcategory" ,subcategory )
app.use("/subsubcategory" ,subsubcategory )
app.use("/product" ,product )
app.use("/wishlist" ,wishlist )





const port = process.env.PORT;
server.listen(port, async () =>{
console.log(`app is  Running on ${port}`);

});




mongoose.connect(process.env.MONGO_URI,{
}).then(con=>{
console.log("Connected To Data Base")
  
})