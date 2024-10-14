const HealthCard = require('../models/HealthCard');


exports.createHealthCard = async (req, res) => {
	console.log('Received data:', req.body);
	try {
		const newCard = new HealthCard(req.body);
		const savedCard = await newCard.save();
		res.status(201).json(savedCard);

	} catch (error) {
		console.error('Error saving health card:', error);
		res.status(500).json({ message: 'Error saving health card', error: error.message });
	}
};

exports.checkHealthCardExists = async (req, res) => {
	const email = req.params.email;
	try {
		const healthCard = await HealthCard.findOne({ email });
		if (healthCard) {
			return res.status(200).json({ exists: true });
		} else {
			return res.status(404).json({ exists: false });
		}
	} catch (error) {
		console.error('Error checking health card:', error);
		res.status(500).json({ message: 'Error checking health card', error: error.message });
	}
};

exports.getHealthCardByEmail = async (req, res) => {
	const email = req.params.email;
	try {
		const healthCard = await HealthCard.findOne({ email });
		if (!healthCard) {
			return res.status(404).json({ message: 'Health card not found' });
		}
		res.status(200).json(healthCard);
	} catch (error) {
		console.error('Error fetching health card:', error);
		res.status(500).json({ message: 'Error fetching health card', error: error.message });
	}
};