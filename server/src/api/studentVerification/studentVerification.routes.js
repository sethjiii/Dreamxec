const express=require("express")
const { protect } = require("../../middleware/auth.middleware");
const router=express.Router()
const {verify, createOrder}=require("./studentverfication.controller")
const multer = require('multer');

// Configure Multer
const upload = multer({ 
    dest: 'uploads/',
  });

router.use(protect)

router.post("/verify", upload.single('document'), verify)
router.post("/create-order", createOrder)

module.exports=router
