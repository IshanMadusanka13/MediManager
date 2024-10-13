const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const database = require('./utils/database');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database
database.connect()
  .then(() => {
    logger.info('Connected to the database');
    
    // Routes
    const authRoutes = require('./routes/authRoutes');
    const staffRoutes = require('./routes/staffRoutes');
    const scheduleRoutes = require('./routes/scheduleRoutes');
    const appointmentRoutes = require('./routes/appointmentRoutes');
    const doctorRoutes = require('./routes/doctorRoutes');
    const patientRoutes = require('./routes/patientRoutes');
    const wardRoutes = require('./routes/wardRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/staff', staffRoutes);
    app.use('/api/schedules', scheduleRoutes);
    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/doctor', doctorRoutes);
    app.use('/api/ward', wardRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
