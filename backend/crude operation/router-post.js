require('dotenv').config(); // to config the .env file 
const multer = require("multer")
const express = require("express");
const mongoose = require('mongoose'); // this must be core module
const router = express.Router();
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err))
// create shema
const employerSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    comment: {type: String, required: true}   
}); 
 
// creating "employee" collection in the mongodb and class for object templaten(data from client e.g: req.body).
const employer = mongoose.model("sideJob", employerSchema);
const uploadFileLocation = multer.diskStorage({destination: (req, file, cb)=>{
  cb(null, path.join(__dirname,'files'))},
 filename: (req, file, cb)=>{
  cb(null, new Date() + "_" + file.originalname)
 }});
 const upload = multer({storage: uploadFileLocation, limits: {fileSize: 5*1024*1024}}); 

router.post("/sidejob",upload.single("uploadFile"), async (req,res)=>{
    try{
const newEmployer = new employer(req.body); // creating object from class
    await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json(newEmployer);
    }catch(err){
        res.status(500).json({MSg: "internal server error"}); 
    }
});


module.exports = router;