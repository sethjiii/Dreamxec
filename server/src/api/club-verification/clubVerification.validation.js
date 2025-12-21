const { z } = require("zod");

exports.clubVerificationSchema = z.object({
  body: z.object({
    collegeName: z.string().min(1),
    studentEmail: z.string().email(),
    studentPhone: z.string().min(5),
    presidentName: z.string().min(1),
    ficName: z.string().min(1),
    ficEmail: z.string().email(),
    ficPhone: z.string().min(5),
  }),
});
