const { z } = require("zod");

const emptyToUndefined = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.string().trim().optional(),
);

const mentorApplicationSchema = z
  .object({
    // 1. Basic Information
    name: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(2, "Full name is required")
      .max(100),

    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format")
      .transform((value) => value.toLowerCase()),

    linkedin: z
      .union([
        z.string().trim().url("Invalid LinkedIn URL"),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) =>
        value === "" || value === null ? undefined : value,
      ),

    role: z
      .string({ required_error: "Current role/title is required" })
      .trim()
      .min(2, "Current role/title is required")
      .max(100),

    organization: emptyToUndefined.refine(
      (value) => !value || value.length <= 150,
      "Organization must be at most 150 characters",
    ),

    country: z
      .string({ required_error: "Country is required" })
      .trim()
      .min(2, "Country is required")
      .max(100),

    city: emptyToUndefined.refine(
      (value) => !value || value.length <= 100,
      "City must be at most 100 characters",
    ),

    yearsOfExperience: z.coerce
      .number({ invalid_type_error: "Years of experience must be a number" })
      .int("Years of experience must be a number")
      .min(0)
      .max(70),

    // 2. Area of Expertise
    expertiseAreas: z
      .array(z.string().trim())
      .min(1, "Select at least one area of expertise"),

    // 3. Credibility Check
    achievement: z
      .string({ required_error: "Achievement is required" })
      .trim()
      .min(10, "Achievement must be at least 10 characters")
      .max(1000),

    mentoringExperience: z.enum(["Yes", "No"], {
      errorMap: () => ({
        message: "Select Yes or No for mentoring experience",
      }),
    }),

    mentoringDescription: z
      .union([z.string().trim().max(1000), z.literal(""), z.null()])
      .optional()
      .transform((value) =>
        value === "" || value === null ? undefined : value,
      ),

    projectsOrResearch: emptyToUndefined.refine(
      (value) => !value || value.length <= 1000,
      "Projects or research must be at most 1000 characters",
    ),

    // 4. Mentorship Intent
    mentorshipIntent: z
      .string({ required_error: "Mentorship intent is required" })
      .trim()
      .min(10, "Intent must be at least 10 characters")
      .max(1000),

    // 5. Scenario Question
    scenarioResponse: z
      .string({ required_error: "Scenario response is required" })
      .trim()
      .min(20, "Response must be at least 20 characters")
      .max(1500),

    // 6. Commitment
    monthlyCommitment: z.enum(
      ["2-3 hours", "4-6 hours", "6-10 hours", "10+ hours"],
      {
        errorMap: () => ({
          message: "Select a valid monthly commitment level",
        }),
      },
    ),

    mentorshipFormat: z
      .array(
        z.enum([
          "1:1 Mentorship",
          "Group Mentorship",
          "Project Guidance",
          "Research Guidance",
          "Workshops",
        ]),
      )
      .min(1, "Select at least one mentorship format"),

    // 7. Student Impact
    studentPreference: z
      .array(
        z.enum([
          "Beginners",
          "Intermediate builders",
          "Startup founders",
          "Researchers",
        ]),
      )
      .min(1, "Select at least one student preference"),

    // 8. Proof of Work
    portfolioLinks: emptyToUndefined.refine(
      (value) => !value || value.length <= 500,
      "Portfolio links must be at most 500 characters",
    ),

    // 9. Values Alignment
    innovationImpactView: z
      .string({ required_error: "Innovation impact view is required" })
      .trim()
      .min(10, "Must be at least 10 characters")
      .max(1000),

    // 10. Final Filter Question
    studentMistakeObservation: z
      .string({ required_error: "Student mistake observation is required" })
      .trim()
      .min(10, "Must be at least 10 characters")
      .max(1000),

    // Elite Filter (Optional)
    thirtyDayBuildPlan: emptyToUndefined.refine(
      (value) => !value || value.length <= 1500,
      "Build plan must be at most 1500 characters",
    ),

    // Public Feature
    publicMentorFeature: z.boolean().optional().default(false),

    // Network Expansion
    mentorReferral: emptyToUndefined.refine(
      (value) => !value || value.length <= 500,
      "Mentor referral must be at most 500 characters",
    ),
  })
  .superRefine((data, ctx) => {
    if (data.mentoringExperience === "Yes") {
      if (!data.mentoringDescription || data.mentoringDescription.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mentoringDescription"],
          message: "Mentoring description must be at least 10 characters",
        });
      }
    }
  });

/**
 * Validate mentor application data
 * @param {Object} data - Application data to validate
 * @returns {Object} - { error, value }
 */
const validateMentorApplication = (data) => {
  const parsed = mentorApplicationSchema.safeParse(data);

  if (parsed.success) {
    return { error: null, value: parsed.data };
  }

  const firstIssue = parsed.error.issues[0];
  return {
    error: {
      name: "ValidationError",
      message: firstIssue?.message || "Validation failed",
      details: parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path,
      })),
    },
    value: null,
  };
};

module.exports = {
  validateMentorApplication,
  mentorApplicationSchema,
};
