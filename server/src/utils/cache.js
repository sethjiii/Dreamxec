const redis = require('../services/redis.service');

/**
 * Get a cached value by key.
 * Returns parsed JS object or null on miss/error.
 */
const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error(`[Cache] GET error for key "${key}":`, err.message);
    return null;
  }
};

/**
 * Store a value in cache.
 * @param {string} key
 * @param {any} value  — will be JSON.stringify'd
 * @param {number} ttl — seconds
 */
const setCache = async (key, value, ttl = 60) => {
  try {
    await redis.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.error(`[Cache] SET error for key "${key}":`, err.message);
  }
};

/**
 * Delete one or more keys.
 * Supports a trailing * wildcard via SCAN, e.g. delCache('public:projects*')
 * @param {string} pattern
 */
const delCache = async (pattern) => {
  try {
    if (!pattern.includes('*')) {
      await redis.del(pattern);
      return;
    }
    // SCAN-based wildcard delete
    let cursor = 0;
    do {
      const reply = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = reply.cursor;
      if (reply.keys.length) {
        await redis.del(reply.keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error(`[Cache] DEL error for pattern "${pattern}":`, err.message);
  }
};

module.exports = { getCache, setCache, delCache };
