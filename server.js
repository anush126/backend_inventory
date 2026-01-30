const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// ✅ CORS configuration (FIXES your error)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontend-inventory-an8n9ksn2-anushs-projects-ad1fd8c3.vercel.app"
  ],
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
