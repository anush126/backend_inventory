const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

const router = express.Router();

// Add Sale
router.post("/", async (req, res) => {
  try {
    // Decrease product stock based on sale quantity
    const qty = Math.max(1, Number(req.body.quantity) || 1);
    const product = await Product.findOne({ name: req.body.productName, category: req.body.category });
    if (!product) {
      return res.status(400).json({ error: "Product not found for this sale (name+category)." });
    }
    if ((Number(product.stock) || 0) < qty) {
      return res.status(400).json({ error: "Insufficient stock for this sale." });
    }
    product.stock = (Number(product.stock) || 0) - qty;
    await product.save();

    const sale = new Sale({ ...req.body, quantity: qty });
    await sale.save();

    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Sale
router.put("/:id", async (req, res) => {
  try {
    const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Sale not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Sale
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Sale.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Sale not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
