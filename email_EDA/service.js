import dotenv from "dotenv";
dotenv.config();

import "./infra/redisBridge.js"; // Starts the bridge
import EmailOrchestrator from "./email/EmailOrchestrator.js";
import "./email/workers/emailWorker.js"; // Starts the worker in the same process for simplicity, or run separately

console.log("-----------------------------------------");
console.log("   DREAMXEC EMAIL EDA SERVICE STARTED    ");
console.log("-----------------------------------------");

// Initialize Orchestrator
new EmailOrchestrator();

// Keep process alive
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
