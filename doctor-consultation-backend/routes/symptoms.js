const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');

// Get all symptoms
router.get('/', async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new symptom
router.post('/', async (req, res) => {
  const symptom = new Symptom({
    name: req.body.name,
    description: req.body.description,
    advice: req.body.advice,
    severity: req.body.severity
  });

  try {
    const newSymptom = await symptom.save();
    res.status(201).json(newSymptom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;