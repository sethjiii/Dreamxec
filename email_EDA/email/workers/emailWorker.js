import { Worker } from "bullmq";
import redisClient from "../../infra/redis.js";
import EmailDispactcher from "../EmailDispactcher.js";

const emailWorker = new Worker("emailQueue", async (job) => {
    await new EmailDispactcher().dispatch({ ...job.data });
}, { connection: redisClient });

export default emailWorker;