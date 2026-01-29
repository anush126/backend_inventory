const express = require("express");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

const router = express.Router();

// Add Purchase
router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    // Keep Products stock in sync (upsert by name+category)
    const qty = Number(req.body.stock) || 0;
    if (qty !== 0) {
      await Product.findOneAndUpdate(
        { name: req.body.name, category: req.body.category },
        {
          $setOnInsert: { name: req.body.name, category: req.body.category, stock: 0 },
          $inc: { stock: qty }
        },
        { upsert: true, new: true }
      );
    }

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find();
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
