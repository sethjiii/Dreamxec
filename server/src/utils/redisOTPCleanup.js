const redis = require("../services/redis.service");

const OTP_KEY_PATTERNS = [
  "otp:*",
  "attempts:*",
  "cooldown:*",
  "rate_limit:*",
  "otp_lock:*",
  "verified:*",
];

const cleanupOtpRedisKeys = async () => {
  console.log("🧹 Starting Redis OTP cleanup...");
  let totalDeleted = 0;

  for (const pattern of OTP_KEY_PATTERNS) {
    let cursor = 0;

    do {
      const { cursor: nextCursor, keys } = await redis.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = Number(nextCursor);

      if (keys.length > 0) {
        await redis.del(keys);
        totalDeleted += keys.length;
      }
    } while (cursor !== 0);
  }

  return totalDeleted;
};

module.exports = cleanupOtpRedisKeys;
