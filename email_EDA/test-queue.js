import emailQueueService, { JOB_PRIORITY } from "./email/queue/emailQueue.js";
import emailWorker from "./email/workers/emailWorker.js";

async function testEmailQueue() {
    console.log("Starting Email Queue Test...");

    // 1. Add Jobs with different priorities
    console.log("[Test] Adding High, Medium, Low priority jobs...");
    
    // Low Priority
    await emailQueueService.add("TestJob", { type: "LOW", id: 3 }, { priority: JOB_PRIORITY.LOW });
    // Medium
    await emailQueueService.add("TestJob", { type: "MEDIUM", id: 2 }, { priority: JOB_PRIORITY.MEDIUM });
    // High
    await emailQueueService.add("TestJob", { type: "HIGH", id: 1 }, { priority: JOB_PRIORITY.HIGH });

    console.log("[Test] Jobs added. Waiting for worker to process...");

    // Worker is already initiated by import. It should pick up jobs.
    // BullMQ prioritises lower number (1 is higher priority than 10).
    // So we expect processing order: HIGH (1) -> MEDIUM (2) -> LOW (3), OR depending on insertion time if they are fetched in batch.
    // Actually, BullMQ priority strictly orders them.

    // Let's wait a bit and see logs.
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("[Test] Closing worker and queue...");
    await emailWorker.close();
    await emailQueueService.getQueue().close();
    
    // We also need to close the QueueEvents connection inside Service if we want clean exit, but for test script we can just exit.
    // (The service doesn't have a close method for events exposed, but it's fine for now).
    
    console.log("Test Completed.");
    process.exit(0);
}

testEmailQueue().catch(console.error);
