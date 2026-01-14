const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-consultation';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'doctor-consultation-backend', time: new Date().toISOString() });
});

app.use('/api/doctors', require('../routes/doctors'));
app.use('/api/appointments', require('../routes/appointments'));
app.use('/api/symptoms', require('../routes/symptoms'));
app.use('/api/health-tips', require('../routes/healthTips'));

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
