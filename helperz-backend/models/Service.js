const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  // fields here id,title, icon ,price,description
  title: { type: String, required: true},
  image: {
    url: {
        type: String,
        default: ""
    },
    public_id: {
        type: String,
        default: ""
    }
},
  // icon: { type: String, required: true },

  price: { type: Number, required: true},
  description: {type: String, required: true},
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotConfig: {
    workingDays: [{
        type: String
    }],
    times: [{
        type: String
    }]
  },
  
},{
  timestamps:true
})

module.exports = mongoose.model('Service', serviceSchema);