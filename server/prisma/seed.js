const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const IMAGE_URL =
  "https://res.cloudinary.com/dvqeeun29/image/upload/v1766282266/dx-logo-2_1_niibs4.png";

async function main() {
  console.log("🌱 Seeding DreamXec database...");

  const hashedPassword = await bcrypt.hash("Password@123", 12);

  // --------------------------------
  // 1️⃣ STUDENT USER
  // --------------------------------
  const student = await prisma.user.create({
    data: {
      name: "Aarav Student",
      email: "student@dreamxec.com",
      password: hashedPassword,
      role: "USER",
      emailVerified: true,
      isExternallyVerified: false,
    },
  });

  // --------------------------------
  // 2️⃣ DONOR
  // --------------------------------
  const donor = await prisma.donor.create({
    data: {
      name: "DreamXec Foundation",
      email: "donor@dreamxec.com",
      password: hashedPassword,
      organizationName: "DreamXec Foundation",
      verified: true,
      emailVerified: true,
    },
  });

  // --------------------------------
  // 3️⃣ DONOR PROJECT
  // --------------------------------
  const donorProject = await prisma.donorProject.create({
    data: {
      title: "AI Research Internship Program",
      description:
        "Hands-on AI research opportunity for top engineering students.",
      organization: "DreamXec Foundation",
      skillsRequired: ["Python", "Machine Learning", "Research"],
      timeline: "3 Months",
      totalBudget: 500000,
      allocatedFunds: 0,
      imageUrl: IMAGE_URL,
      status: "APPROVED",
      donorId: donor.id,
    },
  });

  // --------------------------------
  // 4️⃣ STUDENT RESEARCH PROJECTS (5)
  // --------------------------------
  const studentProjects = [
    {
      title: "AI-Based Early Disease Detection",
      description:
        "Research on using deep learning models to detect diseases from medical images.",
      skillsRequired: ["Deep Learning", "Python", "Computer Vision"],
      goalAmount: 80000,
    },
    {
      title: "Blockchain for Academic Credential Verification",
      description:
        "Decentralized system to verify academic certificates securely.",
      skillsRequired: ["Blockchain", "Solidity", "Web3"],
      goalAmount: 70000,
    },
    {
      title: "NLP-Based Student Mental Health Analysis",
      description:
        "Using NLP to analyze student feedback and identify mental health risks.",
      skillsRequired: ["NLP", "Python", "Machine Learning"],
      goalAmount: 65000,
    },
    {
      title: "Smart Energy Optimization Using IoT",
      description:
        "Research on IoT sensors and ML to optimize energy usage in campuses.",
      skillsRequired: ["IoT", "ML", "Embedded Systems"],
      goalAmount: 90000,
    },
    {
      title: "Autonomous Campus Navigation Robot",
      description:
        "Designing a low-cost autonomous robot for campus navigation.",
      skillsRequired: ["Robotics", "ROS", "Computer Vision"],
      goalAmount: 100000,
    },
  ];

  for (const project of studentProjects) {
    await prisma.userProject.create({
      data: {
        title: project.title,
        description: project.description,
        companyName: "DreamXec University",
        skillsRequired: project.skillsRequired,
        timeline: "6 Months",
        goalAmount: project.goalAmount,
        amountRaised: 0,
        imageUrl: IMAGE_URL,
        status: "APPROVED",
        userId: student.id,
      },
    });
  }

  // --------------------------------
  // 5️⃣ APPLICATION (STUDENT → DONOR PROJECT)
  // --------------------------------
  await prisma.application.create({
    data: {
      coverLetter:
        "I am passionate about AI research and would love to contribute.",
      skills: ["Python", "ML"],
      status: "PENDING",
      userId: student.id,
      donorProjectId: donorProject.id,
    },
  });

  console.log("✅ DreamXec database seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
