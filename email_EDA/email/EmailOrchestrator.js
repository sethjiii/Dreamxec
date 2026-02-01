import emailQueueService from "./queue/emailQueue.js";
import eventBus, { EVENTS } from "../infra/eventBus.js";
import { EMAIL_RULES } from "./config/emailRules.js";
import RecipientResolver from "./utils/RecipientResolver.js";

class EmailOrchestrator {
    constructor(queue = emailQueueService) {
        this.queue = queue;
        this.init();
    }

    init() {
        console.log("[EmailOrchestrator] Initializing with rules...");
        
        // Iterate over rules to register events dynamically
        for (const [eventName, rules] of Object.entries(EMAIL_RULES)) {
            this.registerEvent(eventName, rules);
        }
    }

    registerEvent(eventName, rules) {
        eventBus.subscribe(eventName, async (data) => {
            console.log(`[EmailOrchestrator] Received event: ${eventName}`);
            
            for (const rule of rules) {
                try {
                    const toEmail = RecipientResolver.resolve(rule.role, data);
                    
                    if (!toEmail) {
                        console.warn(`[EmailOrchestrator] Skipping ${rule.role} email for ${eventName}: No email address resolved.`);
                        continue;
                    }

                    // Validate template
                    if (typeof rule.template !== 'function') {
                        console.error(`[EmailOrchestrator] Invalid template for ${eventName} / ${rule.role}`);
                        continue;
                    }

                    const emailContent = rule.template(data);
                    
                    // Priority is now driven by config
                    const opts = rule.priority ? { priority: rule.priority } : {};

                    await this.queue.add("sendEmail", {
                        providerName: "ses", // Still hardcoded for now, but dispatcher handles fallback
                        to: toEmail,
                        subject: emailContent.subject,
                        html: emailContent.body,
                        eventName, // Metadata
                        role: rule.role // Metadata
                    }, opts);
                    
                    console.log(`[EmailOrchestrator] Queued email for ${rule.role} (${toEmail}) with priority ${rule.priority || 'default'}`);
                } catch (error) {
                    console.error(`[EmailOrchestrator] Error processing ${eventName} for ${rule.role}:`, error);
                }
            }
        });
    }
}

export default EmailOrchestrator;