const jwt = require("jsonwebtoken");

function generateDevToken(userId, role = "USER") {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return token;
}

module.exports = generateDevToken;
