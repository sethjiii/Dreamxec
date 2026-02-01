import { redisClient } from "./redis.js";
import eventBus from "./eventBus.js";

const CHANNEL_NAME = "dreamxec:events"; // Shared channel name

class RedisEventBridge {
    constructor() {
        this.subscriber = redisClient.duplicate();
        this.init();
    }

    async init() {
        this.subscriber.on("error", (err) => {
            console.error("[RedisBridge] Subscriber Error:", err);
        });

        await this.subscriber.connect();
        
        console.log(`[RedisBridge] Subscribing to channel: ${CHANNEL_NAME}`);
        
        await this.subscriber.subscribe(CHANNEL_NAME, (message) => {
            try {
                const { event, data } = JSON.parse(message);
                
                if (event && data) {
                    console.log(`[RedisBridge] Received remote event: ${event}`);
                    // Forward to internal EventBus
                    eventBus.publish(event, data);
                }
            } catch (error) {
                console.error("[RedisBridge] Failed to parse message:", error);
            }
        });
    }
}

export default new RedisEventBridge();
