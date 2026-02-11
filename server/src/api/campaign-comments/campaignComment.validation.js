// campaignComment.validation.js
const { z } = require("zod");

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),
  parentId: z.string().uuid().nullable().optional(),
});

module.exports = {
  createCommentSchema,
};
