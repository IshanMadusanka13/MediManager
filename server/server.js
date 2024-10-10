const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/schedules', scheduleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
