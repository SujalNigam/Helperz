const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["available", "booked", "blocked"],
        default: "available"
    }
}, { timestamps: true });

slotSchema.index(
    {
        providerId: 1,
        serviceId: 1,
        date: 1,
        time: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Slot",slotSchema);