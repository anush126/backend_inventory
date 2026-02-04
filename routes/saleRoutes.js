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

    const dateStr = req.body.date != null ? String(req.body.date).trim() : "";
    let saleDate = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(saleDate.getTime())) saleDate = new Date();

    const sale = new Sale({
      customerName: req.body.customerName,
      productName: req.body.productName,
      category: req.body.category,
      quantity: qty,
      price: Number(req.body.price),
      date: saleDate
    });
    sale.date = saleDate;
    sale.markModified("date");
    await sale.save();

    // Ensure date is in DB: update again so it's definitely persisted
    await Sale.findByIdAndUpdate(sale._id, { date: saleDate }, { runValidators: true });

    const saved = await Sale.findById(sale._id).lean();
    console.log("[Sales] New sale saved with date:", saved?.date ? new Date(saved.date).toISOString() : "MISSING");
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Sale
router.put("/:id", async (req, res) => {
  try {
    const dateStr = req.body.date != null ? String(req.body.date).trim() : "";
    const update = {
      customerName: req.body.customerName,
      productName: req.body.productName,
      category: req.body.category,
      quantity: Math.max(1, Number(req.body.quantity) || 1),
      price: Number(req.body.price),
      date: dateStr ? new Date(dateStr) : new Date()
    };
    if (isNaN(update.date.getTime())) update.date = new Date();
    const updated = await Sale.findByIdAndUpdate(req.params.id, update, {
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
