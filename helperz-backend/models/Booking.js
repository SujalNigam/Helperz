const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  contactName: {type: String, required:true},
  contactNumber: {type:Number, required:true},
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref:'Service', required: true},
  price: { type: Number, required: true},
  status: {type: String, default:'pending', enum: ['pending','accepted','rejected','cancelled'], required: true},
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address:{type:String, required:true},
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true
},
serviceName: {
    type: String,
    required: true
}
})

module.exports = mongoose.model('Booking', bookingSchema);