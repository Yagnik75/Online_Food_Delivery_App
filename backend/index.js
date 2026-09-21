// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// // ── Route imports (each member uncomments theirs when ready) ──────────────────
// import customerRoutes from "./routes/customerRoutes.js";       // Sourav
// import sellerRoutes from "./routes/sellerRoutes.js";           // Subhroneel
// import productRoutes from "./routes/productRoutes.js";         // Suchi
// import shopRoutes from "./routes/shopRoutes.js";               // Yagnik

// dotenv.config();

// const app = express();

// // ── Connect to MongoDB Atlas ───────────────────────────────────────────────────
// connectDB();

// // ── Middleware ─────────────────────────────────────────────────────────────────
// app.use(express.json());

// // ── Health check ───────────────────────────────────────────────────────────────
// app.get("/", (req, res) => {
//     res.send("🍔 Food Delivery API is running!");
// });

// // ── Routes ─────────────────────────────────────────────────────────────────────
// app.use("/api/customer", customerRoutes);   // Sourav
// app.use("/api/seller", sellerRoutes);       // Subhroneel
// app.use("/api/product", productRoutes);     // Suchi
// app.use("/api/shop", shopRoutes);           // Yagnik

// // ── Start server ───────────────────────────────────────────────────────────────
// const port = process.env.PORT || 4001;
// app.listen(port, () => {
//     console.log(`🚀 Server is running on http://localhost:${port}`);
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ── NEW: Import CORS ───────────────────────────────
import connectDB from "./config/db.js";
import dns from "dns"; // ── NEW: Import dns to resolve MongoDB hostnames ─────


dns.setServers(["8.8.8.8", "8.8.4.4"]); // ── NEW: Set DNS servers for hostname resolution ─────

// ── Route imports ─────────────────────────────────────────────────────────────
import customerRoutes from "./routes/customerRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";

dotenv.config();

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
// Enable CORS so your React frontend can make API requests
app.use(
      cors( {
        origin: "http://localhost:5173", // Update this if your frontend runs on a different port
        Credentials: true, // Allow cookies to be sent (for authentication)
      })
);
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🍔 Food Delivery API is running!");
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/customer", customerRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/shop", shopRoutes);

// ── Start server ──────────────────────────────────────────────────────────────
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
