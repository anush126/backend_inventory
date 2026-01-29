const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  location: String,
  description: String
});

module.exports = mongoose.model("Supplier", supplierSchema);
