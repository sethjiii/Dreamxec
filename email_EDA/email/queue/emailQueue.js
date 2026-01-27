import redisClient from "../../infra/redis.js";
import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", {connection: redisClient});

export default emailQueue;
