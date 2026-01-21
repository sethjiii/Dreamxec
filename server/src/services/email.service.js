const sgMail = require("@sendgrid/mail");

if (
  process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_API_KEY.startsWith("SG.")
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn(
    "SendGrid API key not configured or invalid. Email functionality disabled."
  );
}

const sendEmail = async ({ email, subject, message }) => {
  console.log("Sending email:", { email, subject });

  if (
    !process.env.SENDGRID_API_KEY ||
    !process.env.SENDGRID_API_KEY.startsWith("SG.")
  ) {
    console.log("Mock email:", { email, subject, message });
    return;
  }

  const msg = {
    to: email,

    // 🔥 THIS IS THE FIX
    from: {
      email: process.env.SENDGRID_FROM_EMAIL, // MUST MATCH AUTH DOMAIN
      name: "DreamXec",
    },

    subject,
    text: message,

    // optional but recommended
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>DreamXec Verification Code</h2>
        <p>Your OTP is:</p>
        <h1>${message.match(/\d{6}/)?.[0]}</h1>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `,
  };

  try {
    const [response] = await sgMail.send(msg);
    console.log("Email sent:", response.statusCode);
  } catch (error) {
    console.error("Error sending email:");
    console.error(error.response?.body || error);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendEmail;
