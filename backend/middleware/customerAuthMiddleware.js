import { verifyToken } from "../helper/authHelper.js";
import Blacklist from "../model/blacklistModel.js";

const customerAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided. Please log in." });
        }

        // ✅ Extract token FIRST
        const token = authHeader.split(" ")[1];
        console.log("Token received:", token);

        // ✅ Check blacklist
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token invalidated. Please log in again." });
        }

        // ✅ Verify token
        const decoded = verifyToken(token);
        console.log("Decoded:", decoded);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }

        if (decoded.role !== "customer") {
            return res.status(403).json({ message: "Access denied. Customers only." });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.log("Customer Auth Middleware Error:", error);
        return res.status(500).json({ message: "Authentication error" });
    }
};

export default customerAuthMiddleware;