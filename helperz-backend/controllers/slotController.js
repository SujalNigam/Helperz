const Slot = require('../models/Slot');
const Service = require('../models/Service');
const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const getProviderSlots = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const providerId = req.user.id;

        if (req.user.role !== "provider") {
            return res.status(403).json({
                message: "Only providers can view slots."
            });
        }

        const service = await Service.findOne({
            _id: serviceId,
            providerId
        });

        if (!service) {
            return res.status(404).json({
                message: "Service not found or unauthorized."
            });
        }

        const slots = await Slot.find({
            serviceId,
            providerId
        }).sort({
            date: 1,
            time: 1
        });

        return res.status(200).json({
            message: "Provider slots fetched successfully.",
            slots
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const generateSlots = async (req, res) => {
     try {
        const { serviceId } = req.params;
        const { workingDays, times, slotsForNextDays } = req.body;

        const numberOfDays = Number(slotsForNextDays) || 30;

        if (numberOfDays < 1 || numberOfDays > 30) {
            return res.status(400).json({
                message: "Slots can only be generated for 1 to 30 days."
            });
        }

        const providerId = req.user.id;

        if (req.user.role !== "provider") {
            return res.status(403).json({
                message: "Only providers can generate slots."
            });
        }

        if (
            !workingDays ||
            !times ||
            workingDays.length === 0 ||
            times.length === 0
        ) {
            return res.status(400).json({
                message: "Working days and times are required."
            });
        }
        times.sort();

        const service = await Service.findOne({
            _id: serviceId,
            providerId: providerId
        });

        if (!service) {
            return res.status(404).json({
                message: "Service not found or unauthorized."
            });
        }
        //delete future blocked or available slots
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await Slot.deleteMany({
            serviceId,
            date: { $gte: today },
            status: { $in: ["available", "blocked"] }
        });

        //create now
        const slots = [];
         
        for (let i = 0; i < numberOfDays; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dayName = DAYS[currentDate.getDay()];
            

            
            if (workingDays.includes(dayName)) {
                // times = [
                //     "09:00",
                //     "10:00",
                //     "11:00"
                // ]
                for (const time of times) {
                    slots.push({
                    providerId,
                    serviceId,
                    date: currentDate,
                    time,
                    status: "available"
                    });
                }
            }
            
            
            
        }
        if (slots.length > 0) {
            await Slot.insertMany(slots);
        }
        service.slotConfig = {
            workingDays,
            times,
            slotsForNextDays: numberOfDays
        };

        await service.save();

        return res.status(201).json({
            message: "Slots generated successfully.",
            slotsCreated: slots.length
        });

        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


// const getAvailableSlots = async (req, res) => {
//     try{
//         const { serviceId } = req.params;
//         const { date } = req.query;

//         const service = await Service.findById(serviceId);
//         if(!service){
//             return res.status(404).json({message:'Service not found.'});
//         }

//         const query = {
//             serviceId,
//             status: "available"
//         };

//         if (date && isNaN(new Date(date).getTime())) {
//                 return res.status(400).json({
//                     message: "Invalid date."
//                 });
//             }

//             if (date) {
//             const start = new Date(date);
//             start.setHours(0, 0, 0, 0);

//             const end = new Date(start);
//             end.setDate(end.getDate() + 1);

//             query.date = {
//                 $gte: start,
//                 $lt: end
//             };

//         }

        
//             const slots = await Slot.find(query)
//             .sort({
//                 date: 1,
//                 time: 1
//             });
//             return res.status(200).json({message:'Available Slots fetched successfully',slots}); 
//         }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({message:'Internal Server Error'});
//     }
       
// }

const getAvailableSlots = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { date } = req.query;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                message: 'Service not found.'
            });
        }

        const query = {
            serviceId,
            status: "available"
        };

        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({
                message: "Invalid date."
            });
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            query.date = {
                $gte: start,
                $lt: end
            };
        }

        const currentTime = new Date();

        const slots = await Slot.find(query)
            .sort({
                date: 1,
                time: 1
            });

        const availableSlots = slots.filter((slot) => {
            const appointmentDateTime = new Date(slot.date);

            const [hours, minutes] = slot.time.split(":").map(Number);

            appointmentDateTime.setHours(hours, minutes, 0, 0);

            return appointmentDateTime > currentTime;
        });

        return res.status(200).json({
            message: 'Available Slots fetched successfully',
            slots: availableSlots
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const updateSlotStatus = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { status } = req.body;

        if (req.user.role !== "provider") {
            return res.status(403).json({
                message: "Only providers can update slots."
            });
        }

        if (!["available", "blocked"].includes(status)) {
            return res.status(400).json({
                message: "Invalid slot status."
            });
        }

        const slot = await Slot.findOne({
            _id: slotId,
            providerId: req.user.id
        });

        if (!slot) {
            return res.status(404).json({
                message: "Slot not found or unauthorized."
            });
        }

        // A booked slot cannot be changed through availability management
        if (slot.status === "booked") {
            return res.status(400).json({
                message: "Booked slots cannot be changed."
            });
        }

        slot.status = status;

        await slot.save();

        return res.status(200).json({
            message: `Slot ${status === "blocked" ? "blocked" : "unblocked"} successfully.`,
            slot
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    generateSlots,
    getAvailableSlots,
    getProviderSlots,
    updateSlotStatus
};
