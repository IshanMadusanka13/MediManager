const mongoose = require('mongoose');

const DischargeSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  dischargeDate: {
    type: Date,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Discharge', DischargeSchema);
