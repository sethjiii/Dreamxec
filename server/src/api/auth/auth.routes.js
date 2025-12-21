const express = require("express");
const passport = require("passport");
const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validation");

const { protect } = require("../../middleware/auth.middleware");

// --- NEW IMPORTS FOR LINKEDIN OIDC ---
const { generators } = require("openid-client");
const getLinkedInClient = require("../../config/linkedin-oidc");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

// Import processOAuthUser directly
const { processOAuthUser } = require("../../config/passport");

// --------------------------------------------
const router = express.Router();

// AUTH ROUTES
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/me", protect, authController.getMe);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// --------------------------------------------
// GOOGLE OAUTH (Passport)
// --------------------------------------------
router.get("/google", (req, res, next) => {
  const role = req.query.role || "USER";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authController.googleCallback
);

// --------------------------------------------
// LINKEDIN LOGIN (OIDC)
// --------------------------------------------
router.get("/linkedin", async (req, res) => {
  try {
    const role = req.query.role || "USER";
    const client = await getLinkedInClient();

    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);

    req.session.codeVerifier = codeVerifier;
    req.session.oauthRole = role;

    const authUrl = client.authorizationUrl({
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state: role,
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("LinkedIn login error:", error);
    res.status(500).json({ message: "LinkedIn login failed" });
  }
});

// --------------------------------------------
// LINKEDIN CALLBACK (OIDC)
// --------------------------------------------
router.get("/linkedin/callback", async (req, res, next) => {
  try {
    const client = await getLinkedInClient();
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      process.env.LINKEDIN_CALLBACK_URL,
      params,
      {
        code_verifier: req.session.codeVerifier,
        state: req.session.oauthRole,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);

    // Convert OIDC profile → same format as Google profile
    const profile = {
      id: userInfo.sub,
      displayName: userInfo.name,
      emails: [{ value: userInfo.email }],
    };

    const user = await processOAuthUser("linkedinId", profile);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error("LinkedIn OIDC callback error:", err);
    next(new AppError("LinkedIn authentication failed", 401));
  }
});

module.exports = router;
