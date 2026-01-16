const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const updateProfile = async (req, res) => {
    try {
        const email = req.user?.email || req.body.email;
        const body = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        console.log("Syncing profile for:", email);

        // CORRECT PRISMA STRUCTURE
        const profile = await prisma.studentProfile.upsert({
            where: { 
                email: email // This must be @unique in your schema.prisma
            }, 
            update: {
                name: body.name,
                phone: body.phone,
                collegeName: body.collegeName,
                yearOfStudy: body.yearOfStudy,
                bio: body.bio,
                address: body.address,
                skills: body.skills, // Ensure this is String[] in your schema
                projectTitle: body.projectTitle,
                portfolioUrl: body.portfolioUrl,
                githubUrl: body.githubUrl,
                linkedInUrl: body.linkedInUrl,
                instagram: body.instagram,
                facebook: body.facebook,
                twitter: body.twitter,
                reddit: body.reddit,
            },
            create: {
                email: email,
                name: body.name,
                phone: body.phone,
                collegeName: body.collegeName,
                yearOfStudy: body.yearOfStudy,
                bio: body.bio,
                address: body.address,
                skills: body.skills,
                projectTitle: body.projectTitle,
                portfolioUrl: body.portfolioUrl,
                githubUrl: body.githubUrl,
                linkedInUrl: body.linkedInUrl,
                instagram: body.instagram,
                facebook: body.facebook,
                twitter: body.twitter,
                reddit: body.reddit,
            },
        });

        res.status(200).json({
            success: true,
            message: "Student profile updated successfully!",
            data: profile
        });

    } catch (error) {
        console.error("Prisma Error Details:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

module.exports = { updateProfile };