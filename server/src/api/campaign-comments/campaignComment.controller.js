// campaignComment.controller.js
const {
  createComment,
  getCommentsByCampaign,
  getCommentById,
  softDeleteComment,
  flagComment,
} = require("./campaignComment.service");

const { createCommentSchema } = require("./campaignComment.validation");

exports.create = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const userId = req.user.id;

    const parsed = createCommentSchema.parse(req.body);

    const comment = await createComment({
      campaignId,
      userId,
      content: parsed.content,
      parentId: parsed.parentId || null,
    });

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;

    const comments = await getCommentsByCampaign(campaignId);

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

exports.remove = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow: comment owner OR campaign owner
    if (
      comment.userId !== userId &&
      comment.campaign.userId !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await softDeleteComment(commentId);

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

exports.report = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    await flagComment(commentId);

    return res.status(200).json({ message: "Comment flagged" });
  } catch (err) {
    return res.status(500).json({ message: "Flag failed" });
  }
};
