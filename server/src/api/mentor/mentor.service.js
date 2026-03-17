const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

/**
 * Create a new mentor application
 * @param {Object} mentorData - Validated mentor application data
 * @returns {Promise<Object>} - Created mentor application document
 */
exports.createMentorApplication = async (mentorData) => {
  console.log("🔧 [Service] Creating mentor application...");
  console.log("🔧 [Service] Input data keys:", Object.keys(mentorData));

  try {
    // Check if email already exists
    const existingMentor = await prisma.mentorApplication.findUnique({
      where: { email: mentorData.email },
    });

    if (existingMentor) {
      console.warn("⚠️ [Service] Email already registered:", mentorData.email);
      throw new AppError("An application with this email already exists", 409);
    }

    console.log("🔧 [Service] Email check passed, creating application...");

    // Create mentor application
    const mentorApplication = await prisma.mentorApplication.create({
      data: {
        ...mentorData,
        status: "PENDING",
      },
    });

    console.log(
      "✅ [Service] Mentor application created successfully:",
      mentorApplication.id,
    );
    return mentorApplication;
  } catch (error) {
    if (error instanceof AppError) {
      console.error("❌ [Service] AppError:", error.message);
      throw error;
    }
    console.error(
      "❌ [Service] Mentor creation error:",
      error?.message || error,
    );
    throw new AppError("Failed to create mentor application", 500);
  }
};

/**
 * Get a mentor application by ID
 * @param {String} id - Mentor application ID
 * @returns {Promise<Object>} - Mentor application document
 */
exports.getMentorApplicationById = async (id) => {
  const mentorApplication = await prisma.mentorApplication.findUnique({
    where: { id },
  });

  if (!mentorApplication) {
    throw new AppError("Mentor application not found", 404);
  }

  return mentorApplication;
};

/**
 * Get all mentor applications (admin only)
 * @param {Object} filters - Filters for querying
 * @returns {Promise<Array>} - Array of mentor applications
 */
exports.getAllMentorApplications = async (filters = {}) => {
  const {
    status,
    skip = 0,
    take = 50,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const where = {};
  if (status) {
    where.status = status;
  }

  const mentorApplications = await prisma.mentorApplication.findMany({
    where,
    skip: parseInt(skip),
    take: parseInt(take),
    orderBy: { [sortBy]: sortOrder },
  });

  return mentorApplications;
};

/**
 * Get mentor applications count by status (admin dashboard)
 * @returns {Promise<Object>} - Count by status
 */
exports.getMentorApplicationsStats = async () => {
  const stats = await prisma.mentorApplication.groupBy({
    by: ["status"],
    _count: true,
  });

  const result = {};
  stats.forEach((stat) => {
    result[stat.status] = stat._count;
  });

  return result;
};

/**
 * Update mentor application status (admin only)
 * @param {String} id - Mentor application ID
 * @param {String} status - New status (PENDING, REVIEWED, APPROVED, REJECTED)
 * @param {String} adminNotes - Optional admin notes
 * @returns {Promise<Object>} - Updated mentor application
 */
exports.updateMentorApplicationStatus = async (
  id,
  status,
  adminNotes = null,
) => {
  const validStatuses = ["PENDING", "REVIEWED", "APPROVED", "REJECTED"];

  if (!validStatuses.includes(status)) {
    throw new AppError(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      400,
    );
  }

  const mentorApplication = await prisma.mentorApplication.update({
    where: { id },
    data: {
      status,
      adminNotes,
      updatedAt: new Date(),
    },
  });

  return mentorApplication;
};

/**
 * Score mentor application (admin only)
 * @param {String} id - Mentor application ID
 * @param {Number} score - Score out of 100
 * @returns {Promise<Object>} - Updated mentor application
 */
exports.scoreMentorApplication = async (id, score) => {
  if (score < 0 || score > 100) {
    throw new AppError("Score must be between 0 and 100", 400);
  }

  const mentorApplication = await prisma.mentorApplication.update({
    where: { id },
    data: {
      score,
      updatedAt: new Date(),
    },
  });

  return mentorApplication;
};

/**
 * Get high-quality mentors (score >= 80 and status APPROVED)
 * @returns {Promise<Array>} - Array of high-quality mentors
 */
exports.getHighQualityMentors = async () => {
  const mentors = await prisma.mentorApplication.findMany({
    where: {
      AND: [{ status: "APPROVED" }, { score: { gte: 80 } }],
    },
    orderBy: { score: "desc" },
  });

  return mentors;
};

/**
 * Delete mentor application (admin only)
 * @param {String} id - Mentor application ID
 * @returns {Promise<void>}
 */
exports.deleteMentorApplication = async (id) => {
  await prisma.mentorApplication.delete({
    where: { id },
  });
};
