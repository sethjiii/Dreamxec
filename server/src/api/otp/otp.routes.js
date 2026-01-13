const express=require("express")
const { protect } = require("../../middleware/auth.middleware");
// const {validate}=require("../../middleware/validate.middleware")
// const {otpSchema}=require("./otp.validation")
const {generateOtp,verifyOtp}=require("./otp.controller")
const router=express.Router()

router.use(protect)
router.post("/generate-otp",generateOtp)
router.post("/verify-otp",verifyOtp)
module.exports=router