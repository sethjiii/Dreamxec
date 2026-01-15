const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const sendEmail = require("../../services/email.service");
const redis = require("../../services/redis.service");

// Constants
const OTP_EXPIRY = 300; // 5 minutes in seconds
const COOLDOWN_PERIOD = 60; // 60 seconds
const BLOCK_PERIOD = 900; // 15 minutes in seconds
const MAX_ATTEMPTS_PER_WINDOW = 3; // Max requests per 15 min
const MAX_VERIFY_ATTEMPTS = 3; // Max incorrect verification attempts

const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

const generateOtp = async (req, res) => {
    try {
        const { email, phonenumber } = req.body;
        const identifier = phonenumber || email;

        if (!identifier) {
            return res.status(400).json({ message: "Phone number or email is required" });
        }

        const rateLimitKey = `rate_limit:${identifier}`;
        const requestCount = await redis.get(rateLimitKey);

        if (requestCount && parseInt(requestCount) >= MAX_ATTEMPTS_PER_WINDOW) {
            const ttl = await redis.ttl(rateLimitKey);
            return res.status(429).json({ 
                message: `Too many requests. Please try again in ${Math.ceil(ttl / 60)} minutes.` 
            });
        }

        const cooldownKey = `cooldown:${identifier}`;
        const isOnCooldown = await redis.get(cooldownKey);

        if (isOnCooldown) {
            const ttl = await redis.ttl(cooldownKey);
            return res.status(429).json({ 
                message: `Please wait ${ttl} seconds before requesting a new OTP.` 
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        const hashedOtp = hashOtp(otp);

        await redis.multi()
            .incr(rateLimitKey)
            .expire(rateLimitKey, BLOCK_PERIOD) 
            .exec();
        
        if (!requestCount) {
             await redis.expire(rateLimitKey, BLOCK_PERIOD);
        }

        await redis.set(cooldownKey, '1', 'EX', COOLDOWN_PERIOD);

        const otpKey = `otp:${identifier}`;
        const attemptsKey = `attempts:${identifier}`;

        await redis.set(otpKey, hashedOtp, 'EX', OTP_EXPIRY);
        await redis.set(attemptsKey, 0, 'EX', OTP_EXPIRY);

        if (email) {
            await sendEmail({ email: email, subject: "OTP Verification", message: `Your OTP is ${otp}. It expires in 5 minutes.` });
        } else if (phonenumber) {
            console.log(`Sending SMS to ${phonenumber}: ${otp}`);
        }

        return res.json({ message: "OTP sent successfully", otp }); 

    } catch (error) {
        console.error("Generate OTP Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { otp, email, phonenumber } = req.body; 
        
        const identifier = phonenumber || email;
        
        if (!identifier || !otp) {
            return res.status(400).json({ message: "Identifier and OTP are required" });
        }

        const otpKey = `otp:${identifier}`;
        const attemptsKey = `attempts:${identifier}`;

        const storedHash = await redis.get(otpKey);
        if (!storedHash) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }
        const attempts = await redis.get(attemptsKey);
        if (attempts && parseInt(attempts) >= MAX_VERIFY_ATTEMPTS) {
            return res.status(429).json({ message: "Too many failed attempts. Verification locked." });
        }

        const submittedHash = hashOtp(otp);
        if (submittedHash === storedHash) {
            await redis.del(otpKey);
            await redis.del(attemptsKey);
            await redis.del(rateLimitKey);        
            return res.json({ message: "OTP verified successfully" });
        } else {
            await redis.incr(attemptsKey);
            return res.status(401).json({ message: "Invalid OTP" });
        }

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { generateOtp, verifyOtp };