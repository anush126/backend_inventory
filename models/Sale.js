const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  category: String,
  quantity: { type: Number, default: 1 },
  price: Number
});

module.exports = mongoose.model("Sale", saleSchema);
