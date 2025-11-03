require('dotenv').config(); // to config the .env file 
const multer = require("multer")
const express = require("express");
const mongoose = require('mongoose'); // this must be core module
const router = express.Router();
const path = require("path");
const cloudinary = require("../cloudinary.js");
const fs = require('fs')

// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL,{family: 4 // use IPv4 
    })
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err))
// create shema
const employerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true}, 
    comment: {type: String, required: true},
    fileUrl: {type: String, required: true}
}); 
 
// creating "employee" collection in the mongodb and class for object templaten(data from client e.g: req.body).
const sideBuisness = mongoose.model("sideBuisness", employerSchema);
const uploadFileLocation = multer.diskStorage({destination: (req, file, cb)=>{
  cb(null, path.join(__dirname,"../files"))}, // this is temporary storage for cloudinary storage
 filename: (req, file, cb)=>{
  cb(null,file.originalname)  
 }});
 const upload = multer({storage: uploadFileLocation, limits: {fileSize: 5*1024*1024}}); 
router.post("/contact",upload.single("uploadFile"), async (req,res)=>{ 
    try{ 
        // to upload the user's file to cloudinary
        const originalFileName = req.file.originalname
    const result = await cloudinary.uploader.upload(req.file.path, { 
      folder: "user_files",
       resource_type: "auto" , // select the type of the file by it self of cloudinary
       public_id: originalFileName,      // 👈 use the original file name
       unique_filename: false,  // 👈 don’t add random characters to the name
       overwrite: true          // optional: allow replacing if same name exists  
    });
   const newBusiness = new sideBuisness({
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      fileUrl: result.secure_url
    }); // creating object from class

    // Delete local file
    fs.unlinkSync(req.file.path);
    await newBusiness.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
     res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅ send JSON this is manadatory to work the front end correctly nice!
    }catch(err){
        res.status(500).json({Msg: "internal server error or problem on database connection"});  
    }
}); 
 
module.exports = router; 