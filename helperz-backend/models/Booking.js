const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  // fields here id,customerName, service, time, status
  name: {type: String, required:true},
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref:'Service', required: true},
  time: { type: Date, required: true },
  price: { type: Number, required: true},
  status: {type: String, default:'pending', enum: ['pending','accepted','rejected','cancelled'], required: true},
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address:{type:String, required:true}
//   customerName:{type: String, required: true}
})

module.exports = mongoose.model('Booking', bookingSchema);