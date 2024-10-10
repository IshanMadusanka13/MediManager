const mongoose = require('mongoose');

// A separate schema to keep track of the sequence
const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model('Counter', CounterSchema);

const StaffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

// Pre-save hook to generate staffId in the format 'S0001'
StaffSchema.pre('save', async function(next) {
  const doc = this;

  if (!doc.isNew) {
    return next(); // Only generate staffId for new documents
  }

  // Find the counter document and increment it
  const counter = await Counter.findOneAndUpdate(
    { id: 'staffId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  // Format the sequence number as 'S0001'
  doc.staffId = `S${counter.seq.toString().padStart(4, '0')}`;
  next();
});

module.exports = mongoose.model('Staff', StaffSchema);
