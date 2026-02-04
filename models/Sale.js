const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  category: String,
  quantity: { type: Number, default: 1 },
  price: Number,
  date: { type: Date, default: Date.now }
});

// Ensure date is always set before save (fallback if not passed)
saleSchema.pre("save", function (next) {
  if (!this.date || !(this.date instanceof Date) || isNaN(this.date.getTime())) {
    this.date = new Date();
  }
  next();
});

module.exports = mongoose.model("Sale", saleSchema);
