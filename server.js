const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// CORS: allow localhost + any Vercel deployment (*.vercel.app) so preview/production URLs work
function corsOrigin(origin, callback) {
  const allowed = [
    "http://localhost:3000",
    "https://frontend-inventory-r6k6j0kdm-anushs-projects-ad1fd8c3.vercel.app",
    "https://frontend-inventory-cnlw18tnf-anushs-projects-ad1fd8c3.vercel.app",
    "https://frontend-inventory-git-main-anushs-projects-ad1fd8c3.vercel.app"
  ].filter(Boolean);
  const fromVercel = origin && origin.endsWith(".vercel.app");
  if (!origin || allowed.includes(origin) || fromVercel) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Inventory Management API is running!" });
});

// Health check endpoint (useful for Render)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
