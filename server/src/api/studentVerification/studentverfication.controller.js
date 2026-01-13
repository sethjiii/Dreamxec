const razorpay = require("../../services/payment.service");
const prisma = require("../../config/prisma");
const uploadToCloudinary = require('../../utils/uploadToCloudinary');


const createOrder = async (req,res)=>{
const order=await razorpay.orders.create({amount: 29 * 100,
    currency: "INR",
    receipt: `${req.user.id}`,
    })
    console.log(order)
    return res.json({order})
}
const verify = async (req, res) => {
    try {
        const { fullName, studentEmail, officialEmail, mobileNumber, docType, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const file = req.file;
        const {user}=req

        if (!file) {
            return res.status(400).json({ message: "Document file is required" });
        }

        const folder = `dreamxec/verifications/${req.user.id}`;
        const documentUrl = await uploadToCloudinary(file.path, folder);

        const verification = await prisma.studentVerification.create({
            data:{
                fullName,
                studentEmail,
                officialEmail,
                mobileNumber,
                docType,
                documentUrl,
                razorpayPaymentId: razorpay_payment_id || null,
                razorpayOrderId: razorpay_order_id || null,
                razorpaySignature: razorpay_signature || null,
                userId: req.user.id,
                status: "PENDING"
            }
        })
        await prisma.user.update({where:{id:user.id},data:{studentVerified:true}})

        return res.json({
            success: true,
            message: "Verification submitted successfully",
            data: verification
        });

    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({ message: "Verification failed", error: error.message });
    }
}

module.exports = { verify,createOrder }