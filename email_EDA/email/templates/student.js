export const studentTemplates = {
  welcomeEmail: (data) => ({
    subject: `Welcome to DreamXec, ${data.name}!`,
    body: `
      <h2>Welcome to DreamXec!</h2>
      <p>Hi ${data.name},</p>
      <p>We are thrilled to have you on board. DreamXec is your platform to connect, create, and campaign.</p>
      <a href="${data.dashboardUrl}">Go to Dashboard</a>
    `
  }),

  emailVerification: (data) => ({
    subject: `Verify your Email Address`,
    body: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email address.</p>
      <p><a href="${data.verificationUrl}">Verify Email</a></p>
      <p>Or use this code: <strong>${data.otp}</strong></p>
    `
  }),

  profileCompletionReminder: (data) => ({
    subject: `Complete your Profile`,
    body: `
      <h2>Complete your Profile</h2>
      <p>Hi ${data.name}, your profile is ${data.percentage}% complete.</p>
      <p>Complete it now to unlock all features.</p>
      <a href="${data.profileUrl}">Complete Profile</a>
    `
  }),

  clubJoinConfirmation: (data) => ({
    subject: `You joined ${data.clubName}!`,
    body: `
      <h2>Club Joined Successfully</h2>
      <p>You have successfully joined <strong>${data.clubName}</strong>.</p>
      <p>Contact Email: ${data.clubEmail}</p>
    `
  }),

  campaignDiscovery: (data) => ({
    subject: `Campaigns you might like`,
    body: `
      <h2>Discover New Campaigns</h2>
      <p>Based on your interests, check out these campaigns:</p>
      <ul>
        ${data.campaigns.map(c => `<li><a href="${c.url}">${c.title}</a></li>`).join('')}
      </ul>
    `
  }),

  platformAnnouncement: (data) => ({
    subject: `Announcement: ${data.title}`,
    body: `
      <h2>${data.title}</h2>
      <p>${data.message}</p>
      <p>Best,<br>The DreamXec Team</p>
    `
  }),

  securityAlert: (data) => ({
    subject: `Security Alert: New Login`,
    body: `
      <h2>New Login Detected</h2>
      <p>We detected a new login from ${data.device} at ${data.time}.</p>
      <p>If this was not you, please secure your account immediately.</p>
    `
  }),
};
