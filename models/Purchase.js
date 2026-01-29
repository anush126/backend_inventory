const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  supplier: String
});

module.exports = mongoose.model("Purchase", purchaseSchema);
