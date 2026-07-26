const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

env.config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI);


const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

app.use('/api/bookings', bookingRoutes);

app.listen(process.env.PORT, ()=>console.log("App listening at port 8000"));