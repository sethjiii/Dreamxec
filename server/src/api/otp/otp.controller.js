const otpGenerator = require('otp-generator')
const jwt=require("jsonwebtoken")
const sendEmail=require("../../services/email.service")
const dotenv=require("dotenv")
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET


const generateOtp =(req,res)=>{
    const {email,phonenumber}=req.body
    const otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    })
    if(email){
        const token=jwt.sign({otp},JWT_SECRET,{expiresIn:"5min"})
        sendEmail({email:email,subject:"Otp Verification",message:otp})
        return res.json({token,otp})
    }
    if(phonenumber){
        console.log(otp)
        const token=jwt.sign({otp},JWT_SECRET,{expiresIn:"5min"})
        console.log(token)
        // sendSms({to:phonenumber,subject:"Otp Verification",text:otp})
        return res.json({token,otp})       
    }

}

const verifyOtp=(req,res)=>{
    const {token,otp}=req.body
    const decoded=jwt.verify(token,JWT_SECRET)
    if(decoded.otp===otp){
        return res.json({message:"Otp verified successfully"})
    }
    return res.status(401).json({message:"Invalid otp"})
}
module.exports={generateOtp,verifyOtp}