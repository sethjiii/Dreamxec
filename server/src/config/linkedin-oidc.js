const { Issuer } = require("openid-client");

let clientInstance = null;

async function getLinkedInClient() {
  if (clientInstance) return clientInstance;

  const linkedInIssuer = new Issuer({
    issuer: "https://www.linkedin.com/oauth",
    authorization_endpoint: "https://www.linkedin.com/oauth/v2/authorization",
    token_endpoint: "https://www.linkedin.com/oauth/v2/accessToken",
    jwks_uri: 'https://www.linkedin.com/oauth/openid/jwks',
    userinfo_endpoint: "https://api.linkedin.com/v2/userinfo",
  });

  clientInstance = new linkedInIssuer.Client({
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    redirect_uris: [process.env.LINKEDIN_CALLBACK_URL],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  });

  return clientInstance;
}

module.exports = getLinkedInClient;
