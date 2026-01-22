const cleanupOtpRedisKeys = require("../../utils/redisOTPCleanup");

exports.cleanupRedis = async (req, res) => {
  const deletedKeys = await cleanupOtpRedisKeys();

  res.json({
    success: true,
    message: "Redis OTP keys cleaned successfully",
    deletedKeys,
  });
};
