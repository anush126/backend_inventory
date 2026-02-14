const express = require("express");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

const router = express.Router();

// Add Purchase
router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    // Update product stock: add purchased quantity to the product (match by name + category)
    const name = (req.body.name && String(req.body.name).trim()) || "";
    const category = (req.body.category && String(req.body.category).trim()) || "";
    const qty = Number(req.body.stock) || 0;

    if (name && qty > 0) {
      const product = await Product.findOne({ name, category });
      if (product) {
        product.stock = (Number(product.stock) || 0) + qty;
        await product.save();
      } else {
        await Product.create({ name, category, stock: qty });
      }
    }

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Purchases (newest first)
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ _id: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Purchase
router.put("/:id", async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Purchase not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Purchase
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Purchase not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
