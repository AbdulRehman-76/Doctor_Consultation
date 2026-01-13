const express = require('express');
const router = express.Router();
const HealthTip = require('../models/HealthTip');

// Get all health tips
router.get('/', async (req, res) => {
  try {
    const tips = await HealthTip.find();
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new health tip
router.post('/', async (req, res) => {
  const tip = new HealthTip({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category
  });

  try {
    const newTip = await tip.save();
    res.status(201).json(newTip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;