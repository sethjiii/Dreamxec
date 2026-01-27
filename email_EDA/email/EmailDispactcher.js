import Provider from "./providers/provider.js";

class EmailDispactcher {
    async dispatch({ providerName, providers, to, subject, html }) {
        // Default order if no specific provider(s) requested: SES -> SendGrid -> SMTP
        const providerList = providers || (providerName ? [providerName] : ['ses', 'sendgrid', 'smtp']);
        let lastError;
        for (const name of providerList) {
            try {
                console.log(`[EmailDispatcher] Attempting to send email via ${name}...`);
                const provider = new Provider().provider(name);
                await provider.sendEmail(to, subject, html);
                console.log(`[EmailDispatcher] Successfully sent email via ${name}`);
                return;
            } catch (error) {
                console.error(`[EmailDispatcher] Failed to send via ${name}:`, error.message);
                lastError = error;
            }
        }
        throw new Error(`All email providers failed. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
    }
}
export default EmailDispactcher;