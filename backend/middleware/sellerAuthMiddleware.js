// // ── SUBHRONEEL'S FILE ─────────────────────────────────────────────────────────
// import { verifyToken } from "../helper/authHelper.js";

// const sellerAuthMiddleware = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "No token provided. Please log in." });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = verifyToken(token);

//         if (!decoded) {
//             return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
//         }

//         if (decoded.role !== "seller") {
//             return res.status(403).json({ message: "Access denied. Sellers only." });
//         }

//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(500).json({ message: "Authentication error" });
//     }
// };

// export default sellerAuthMiddleware;

// ── SUBHRONEEL'S FILE ─────────────────────────────────────────────────────────
import { verifyToken } from "../helper/authHelper.js";
import Blacklist from "../model/blacklistModel.js";

// Note: Added "async" here so we can await the database check!
const sellerAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided. Please log in." });
        }

        const token = authHeader.split(" ")[1];

        // ── NEW: BLACKLIST CHECK ──────────────────────────────────────────────
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token invalidated. Please log in again." });
        }
        // ──────────────────────────────────────────────────────────────────────

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }

        if (decoded.role !== "seller") {
            return res.status(403).json({ message: "Access denied. Sellers only." });
        }

        req.user = decoded; // { id, role } now available in controllers
        next();
    } catch (error) {
        console.log("Seller Auth Middleware Error:", error);
        return res.status(500).json({ message: "Authentication error" });
    }
};

export default sellerAuthMiddleware;