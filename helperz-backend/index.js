const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

env.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());



const userRoutes = require('./routes/userRoutes');
const slotRoutes = require("./routes/slotRoutes");
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use("/api/slots", slotRoutes);

app.use('/api/bookings', bookingRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
// mongoose.connect(process.env.MONGO_URI);
// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });