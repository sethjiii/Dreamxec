const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
    try {
        // 1. Safe Email Retrieval: Pehle check karein req.user hai ya nahi
        const email = req.user?.email || req.body.email;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is required. Please login or provide email in body." 
            });
        }

        const body = req.body;

        // 2. Prisma Upsert
        // Note: Make sure 'email' is marked as @unique in your Prisma Schema
        const profile = await prisma.donorProfile.upsert({
            where: { 
                email: email 
            },
            update: {
                fullName: body.fullName,
                phoneNumber: body.phoneNumber,
                gender: body.gender,
                dob: body.dob ? new Date(body.dob) : null,
                panNumber: body.panNumber,
                education: body.education,
                occupation: body.occupation,
                address: body.address,
                bio: body.bio,
                // Array fields ko set karne ka sahi tarika
                preferredCategories: body.preferredCategories || [],
                isAnonymous: body.isAnonymous === 'true' || body.isAnonymous === true,
                instagram: body.instagram,
                facebook: body.facebook,
                twitter: body.twitter,
                reddit: body.reddit,
            },
            create: {
                email: email,
                fullName: body.fullName,
                phoneNumber: body.phoneNumber,
                gender: body.gender,
                dob: body.dob ? new Date(body.dob) : null,
                panNumber: body.panNumber,
                education: body.education,
                occupation: body.occupation,
                address: body.address,
                bio: body.bio,
                preferredCategories: body.preferredCategories || [],
                isAnonymous: body.isAnonymous === 'true' || body.isAnonymous === true,
                instagram: body.instagram,
                facebook: body.facebook,
                twitter: body.twitter,
                reddit: body.reddit,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Donor profile updated successfully!",
            data: profile
        });

    } catch (error) {
        console.error("Donor Profile Update Error:", error);
        
        // Agar Prisma validation error hai (e.g. email not unique)
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                success: false, 
                message: "A profile with this email already exists but is not unique." 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

module.exports = { updateProfile };