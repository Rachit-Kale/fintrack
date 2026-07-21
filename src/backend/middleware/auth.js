const User = require("../models/User");

const protectDevice = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized: Missing or malformed Authorization header.",
            });
        }

        const token = authHeader.split(" ")[1];
        const user = await User.findOne({ devicePairingToken: token });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized: Invalid pairing token.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ success: false, error: "Authentication check failed." });
    }
};

module.exports = protectDevice;