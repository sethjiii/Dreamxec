// campaignComment.service.js
const prisma = require("../../config/prisma"); // adjust path if needed

async function createComment(data) {
  return prisma.campaignComment.create({
    data,
  });
}

async function getCommentsByCampaign(campaignId) {
  return prisma.campaignComment.findMany({
    where: {
      campaignId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

async function getCommentById(commentId) {
  return prisma.campaignComment.findUnique({
    where: { id: commentId },
    include: {
      campaign: true,
    },
  });
}

async function softDeleteComment(commentId) {
  return prisma.campaignComment.update({
    where: { id: commentId },
    data: { isDeleted: true },
  });
}

async function flagComment(commentId) {
  return prisma.campaignComment.update({
    where: { id: commentId },
    data: { isFlagged: true },
  });
}

module.exports = {
  createComment,
  getCommentsByCampaign,
  getCommentById,
  softDeleteComment,
  flagComment,
};
