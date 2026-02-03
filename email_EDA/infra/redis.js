import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

class RedisService {
  constructor() {
    if (!process.env.REDIS_URL) {
      throw new Error("❌ REDIS_URL is not defined in environment variables for EDA");
    }

    const options = {
      maxRetriesPerRequest: null, // REQUIRED for BullMQ
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    // Optional TLS support (for managed Redis)
    if (process.env.REDIS_TLS === "true") {
      options.tls = {};
    }

    this.client = new Redis(process.env.REDIS_URL, options);
    this.setupListeners();
  }

  setupListeners() {
    this.client.on("connect", () => {
      console.log("[Redis] Connecting...");
    });

    this.client.on("ready", () => {
      console.log("[Redis] Connected & ready");
    });

    this.client.on("error", (err) => {
      console.error("[Redis] Error:", err.message);
    });

    this.client.on("close", () => {
      console.warn("[Redis] Connection closed");
    });

    this.client.on("reconnecting", (time) => {
      console.log(`[Redis] Reconnecting in ${time}ms...`);
    });
  }

  getClient() {
    return this.client;
  }

  async shutdown() {
    console.log("[Redis] Shutting down connection...");
    await this.client.quit();
    console.log("[Redis] Connection shutdown complete.");
  }
}

const redisService = new RedisService();

export default redisService;
export const redisClient = redisService.getClient();
