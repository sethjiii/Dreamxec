const redis = require('./redis.service');

const CHANNEL_NAME = "dreamxec:events";

/**
 * Publish an event to the Email EDA Service via Redis
 * @param {string} eventName - The name of the event (e.g., "CAMPAIGN_SUBMITTED")
 * @param {object} data - The data associated with the event
 */
const publishEvent = async (eventName, data) => {
    try {
        const message = JSON.stringify({ event: eventName, data });
        // Use redis.publish if available (node-redis v4)
        await redis.publish(CHANNEL_NAME, message);
        console.log(`[EventPublisher] Published event: ${eventName}`);
    } catch (error) {
        console.error(`[EventPublisher] Failed to publish event ${eventName}:`, error);
    }
};

module.exports = { publishEvent };
