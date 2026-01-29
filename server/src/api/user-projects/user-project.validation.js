const { z } = require('zod');

/* =========================================================
   Shared Milestone Schema
========================================================= */

// This represents ONE milestone object
const milestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title must be at least 3 characters'),
  timeline: z.string().min(1, 'Milestone timeline is required'),
  budget: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive('Milestone budget must be positive')
  ),
  description: z.string().optional(),
});

/* =========================================================
   CREATE USER PROJECT
========================================================= */

exports.createUserProjectSchema = z.object({
  body: z
    .object({
      title: z.string().min(5).max(200),
      description: z.string().min(20),

      companyName: z
        .string()
        .trim()
        .min(1)
        .optional()
        .transform((v) => (v === '' ? undefined : v)),

      goalAmount: z.preprocess(
        (val) => (typeof val === 'string' ? parseFloat(val) : val),
        z.number().positive('Goal amount must be positive')
      ),

      skillsRequired: z
        .preprocess((val) => {
          if (typeof val === 'string') {
            try {
              return JSON.parse(val);
            } catch {
              throw new Error('Invalid skillsRequired JSON');
            }
          }
          return val;
        }, z.array(z.string()))
        .optional(),

      milestones: z
        .string()
        .transform((val) => {
          try {
            return JSON.parse(val);
          } catch {
            throw new Error('Invalid milestones JSON');
          }
        })
        .pipe(z.array(milestoneSchema).min(1, 'At least one milestone is required')),

      presentationDeckUrl: z.string().url().optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      const totalMilestoneBudget = data.milestones.reduce(
        (sum, m) => sum + m.budget,
        0
      );

      if (totalMilestoneBudget > data.goalAmount) {
        ctx.addIssue({
          path: ['milestones'],
          message: 'Total milestone budget cannot exceed goal amount',
          code: z.ZodIssueCode.custom,
        });
      }
    }),
});


/* =========================================================
   UPDATE USER PROJECT
========================================================= */

exports.updateUserProjectSchema = z.object({
  body: z
    .object({
      title: z.string().min(5).max(200).optional(),
      description: z.string().min(20).optional(),

      companyName: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v === '' ? undefined : v)),

      skillsRequired: z
        .preprocess((val) => {
          if (typeof val === 'string') {
            try {
              return JSON.parse(val);
            } catch {
              throw new Error('Invalid skillsRequired JSON');
            }
          }
          return val;
        }, z.array(z.string()))
        .optional(),

      goalAmount: z
        .preprocess(
          (val) => (typeof val === 'string' ? parseFloat(val) : val),
          z.number().positive()
        )
        .optional(),

      presentationDeckUrl: z.string().url().optional().or(z.literal('')),

      milestones: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          try {
            return JSON.parse(val);
          } catch {
            throw new Error('Invalid milestones JSON');
          }
        })
        .pipe(z.array(milestoneSchema).optional()),
    })
    .superRefine((data, ctx) => {
      if (data.milestones && data.goalAmount !== undefined) {
        const total = data.milestones.reduce(
          (sum, m) => sum + m.budget,
          0
        );

        if (total > data.goalAmount) {
          ctx.addIssue({
            path: ['milestones'],
            message: 'Total milestone budget cannot exceed goal amount',
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
});

