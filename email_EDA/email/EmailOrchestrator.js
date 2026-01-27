import emailQueue from "./queue/emailQueue.js";
import eventBus from "../infra/eventBus.js";
import {
    adminTemplates,
    studentTemplates,
    studentPresidentTemplates,
    donorTemplates
} from "./templates/index.js";

class EmailOrchestrator {
    constructor(queue = emailQueue) {
        this.queue = queue;
        this.init();
    }

    init() {
        this.registerEvent("CAMPAIGN_SUBMITTED", [
            { role: "ADMIN", template: adminTemplates.newCampaignSubmitted }
        ]);
        this.registerEvent("CLUB_VERIFICATION_PENDING", [
            { role: "ADMIN", template: adminTemplates.clubVerificationPending }
        ]);
        this.registerEvent("HIGH_VALUE_DONATION", [
            { role: "ADMIN", template: adminTemplates.highValueDonationAlert }
        ]);
        this.registerEvent("PAYOUT_FAILED", [
            { role: "ADMIN", template: adminTemplates.failedPayoutRefund }
        ]);
        this.registerEvent("REFUND_FAILED", [
            { role: "ADMIN", template: adminTemplates.failedPayoutRefund }
        ]);
        this.registerEvent("SUSPICIOUS_ACTIVITY", [
            { role: "ADMIN", template: adminTemplates.suspiciousActivity }
        ]);
        this.registerEvent("KYC_FAILURE", [
            { role: "ADMIN", template: adminTemplates.kycFailure }
        ]);
        this.registerEvent("SYSTEM_ERROR", [
            { role: "ADMIN", template: adminTemplates.systemError }
        ]);
        this.registerEvent("PLATFORM_REPORT", [
            { role: "ADMIN", template: adminTemplates.platformReport }
        ]);

        // STUDENT EVENTS
        this.registerEvent("USER_WELCOME", [
            { role: "STUDENT", template: studentTemplates.welcomeEmail }
        ]);
        this.registerEvent("EMAIL_VERIFICATION", [
            { role: "STUDENT", template: studentTemplates.emailVerification }
        ]);
        this.registerEvent("PROFILE_REMINDER", [
            { role: "STUDENT", template: studentTemplates.profileCompletionReminder }
        ]);
        this.registerEvent("CLUB_JOINED", [
            { role: "STUDENT", template: studentTemplates.clubJoinConfirmation }
        ]);
        this.registerEvent("CAMPAIGN_SUGGESTION", [
            { role: "STUDENT", template: studentTemplates.campaignDiscovery }
        ]);
        this.registerEvent("PLATFORM_ANNOUNCEMENT", [
            { role: "STUDENT", template: studentTemplates.platformAnnouncement }
        ]);
        this.registerEvent("SECURITY_ALERT", [
            { role: "STUDENT", template: studentTemplates.securityAlert } // Covers "Account security alerts"
        ]);

        // STUDENT PRESIDENT EVENTS
        this.registerEvent("CLUB_VERIFICATION_STATUS", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.clubVerificationStatus }
        ]);
        this.registerEvent("CAMPAIGN_CREATED", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignCreated }
        ]);
        this.registerEvent("CAMPAIGN_LIVE", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignLive }
        ]);
        this.registerEvent("LOW_DONATION_REMINDER", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.lowDonationReminder }
        ]);
        this.registerEvent("CAMPAIGN_COMPLETED", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignCompleted }
        ]);
        this.registerEvent("FUND_WITHDRAWAL_STATUS", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.fundWithdrawalStatus }
        ]);

        // DONOR EVENTS
        this.registerEvent("DONATION_FAILED", [
            { role: "DONOR", template: donorTemplates.donationFailed }
        ]);
        this.registerEvent("THANK_YOU", [
            { role: "DONOR", template: donorTemplates.thankYou }
        ]);
        this.registerEvent("CAMPAIGN_UPDATE", [
            { role: "DONOR", template: donorTemplates.campaignProgress }
        ]);
        this.registerEvent("IMPACT_REPORT", [
            { role: "DONOR", template: donorTemplates.impactReport }
        ]);
        this.registerEvent("DONATE_AGAIN", [
            { role: "DONOR", template: donorTemplates.donateAgain }
        ]);
        this.registerEvent("TAX_RECEIPT", [
            { role: "DONOR", template: donorTemplates.taxReceipt }
        ]);


        this.registerEvent("CAMPAIGN_APPROVED", [
            { role: "ADMIN", template: adminTemplates.campaignStatusUpdate },
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignApprovalStatus }
        ]);
        this.registerEvent("CAMPAIGN_REJECTED", [
            { role: "ADMIN", template: adminTemplates.campaignStatusUpdate },
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignApprovalStatus }
        ]);

        this.registerEvent("DONATION_SUCCESS", [
            { role: "DONOR", template: donorTemplates.donationSuccess },
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.donationReceived },
            { role: "ADMIN", template: (data) => ({ subject: `Donation Received: ${data.amount}`, body: `Donation of ${data.amount} received.` }) } 
        ]);

        this.registerEvent("REFUND_ISSUED", [
            { role: "DONOR", template: donorTemplates.refundStatus },
            { role: "ADMIN", template: adminTemplates.failedPayoutRefund } 
        ]);

        this.registerEvent("CAMPAIGN_MILESTONE", [
            { role: "STUDENT_PRESIDENT", template: studentPresidentTemplates.campaignMilestone },
            { role: "DONOR", template: donorTemplates.campaignProgress } 
        ]);
        
        this.registerEvent("SECURITY_ALERT_ALL", [
             { role: "STUDENT", template: studentTemplates.securityAlert },
             { role: "ADMIN", template: adminTemplates.suspiciousActivity }
        ]);

    }

    registerEvent(eventName, actions) {
        eventBus.on(eventName, async (data) => {
            console.log(`[EmailOrchestrator] Received event: ${eventName}`);
            
            for (const action of actions) {
                try {
                    let toEmail;
                    if (action.role === "ADMIN") toEmail = process.env.ADMIN_EMAIL || "admin@dreamxec.com";
                    else if (action.role === "STUDENT") toEmail = data.studentEmail || data.userEmail || data.email;
                    else if (action.role === "STUDENT_PRESIDENT") toEmail = data.presidentEmail || data.email;
                    else if (action.role === "DONOR") toEmail = data.donorEmail || data.email;
                    if (!toEmail) {
                        console.warn(`[EmailOrchestrator] Skipping ${action.role} email for ${eventName}: No email address found in payload.`);
                        continue;
                    }

                    const emailContent = action.template(data);
                    
                    await this.queue.add("sendEmail", {
                        providerName: "ses",
                        to: toEmail,
                        subject: emailContent.subject,
                        html: emailContent.body
                    });
                    
                    console.log(`[EmailOrchestrator] Queued email for ${action.role} (${toEmail})`);
                } catch (error) {
                    console.error(`[EmailOrchestrator] Error processing ${eventName} for ${action.role}:`, error);
                }
            }
        });
    }
}

export default EmailOrchestrator;