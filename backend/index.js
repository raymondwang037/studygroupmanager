const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studyGroupRoutes = require('./routes/studyGroups');
const studentRoutes = require('./routes/students');
const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Local frontend
  'https://studygroupmanager-1.onrender.com', // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes

app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);


// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});