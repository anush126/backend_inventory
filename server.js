const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
