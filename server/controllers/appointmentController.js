const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    const { date, time, doctor, patient } = req.body;
    try {
      if (!date || !time || !doctor || !patient) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const appointment = new Appointment({ date, time, doctor, patient });
      await appointment.save();
      res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(400).json({ message: 'Error creating appointment', error: error.message });
    }
  };

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching appointments' });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating appointment' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting appointment' });
    }
};
