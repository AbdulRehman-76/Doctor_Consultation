const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
	try {
		const doctors = await Doctor.find();
		res.json(doctors);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get single doctor
router.get('/:id', async (req, res) => {
	try {
		const doctor = await Doctor.findById(req.params.id);
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
		res.json(doctor);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Create new doctor
router.post('/', async (req, res) => {
	const doctor = new Doctor({
		name: req.body.name,
		specialty: req.body.specialty,
		experience: req.body.experience,
		available: req.body.available,
		email: req.body.email,
		phone: req.body.phone,
		qualifications: req.body.qualifications,
	});

	try {
		const newDoctor = await doctor.save();
		res.status(201).json(newDoctor);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Update doctor
router.patch('/:id', async (req, res) => {
	try {
		const doctor = await Doctor.findById(req.params.id);
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

		Object.keys(req.body).forEach((key) => {
			doctor[key] = req.body[key];
		});

		const updatedDoctor = await doctor.save();
		res.json(updatedDoctor);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Delete doctor
router.delete('/:id', async (req, res) => {
	try {
		const deleted = await Doctor.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'Doctor not found' });
		res.json({ message: 'Doctor deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
