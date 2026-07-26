const Booking = require('../models/Booking');
// const authMiddleware = require('../middleware/authMiddleware');


const createBooking = async (req, res) => {
    try {
        const { serviceId, time, price, providerId,address, name } = req.body;

        const customerId = req.user.id;
        const role = req.user.role;

        if(!role){
            console.log('Not Logged In');
            return res.status(400).json({message:'Not Logged In, trying to create booking'});
        }

        if(role!=='customer'){
            console.log('Other than customer trying to create booking. Not possible!')
            return res.status(400).json({message:'Other than customer trying to create booking. Not possible!'})
        }

        const booking = await Booking.create({
            serviceId,
            time,
            price,
            providerId,
            customerId,
            address,
            name
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getProviderBookings = async(req, res)=>{
    try{
        const providerId = req.user.id;
       const bookings = await Booking.find({providerId:providerId})
       .populate('customerId','name email')
       .populate('serviceId','title price');


        if(!bookings){
            return res.status(401).json({message:'Could not fetch Bookings from DB'});
        }
        return res.status(200).json({message:'Bookings are fetched successfully',bookings:bookings});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

const getBookings = async(req, res)=>{
    try{
       const role = req.user.role;
       const bookings = await Booking.find()
       .populate('customerId','name email')
       .populate('serviceId','title price');
        

        if(!bookings){
            return res.status(401).json({message:'Could not fetch All Bookings from DB'});
        }
        return res.status(200).json({message:'All Bookings are fetched successfully',bookings:bookings});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

const getCustomerBookings = async(req, res)=>{
    try{
        const customerId = req.user.id;
       const bookings = await Booking.find({customerId:customerId})
       .populate('customerId','name email')
       .populate('serviceId','title price');


        if(!bookings){
            return res.status(401).json({message:'Could not fetch Bookings from DB'});
        }
        return res.status(200).json({message:'Bookings are fetched successfully',bookings:bookings});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

const updateBookingStatus = async(req,res)=>{
    try{
        const {status} = req.body;
        const bookingId = req.params.bookingId;
        
        if(!bookingId){
            return res.status(401).json({message:'bookingId not reached to backend'});
        }

        const booking = await Booking.findByIdAndUpdate({_id: bookingId},{
            status
        },{new:true});



        return res.status(200).json({message:'Booking is updated successfully',booking:booking});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}
const cancelBooking = async(req,res)=>{
    try{
        const bookingId = req.params.bookingId;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        if(!bookingId){
            return res.status(401).json({message:'bookingId not reached to backend'});
        }

        // const booking = await Booking.findByIdAndUpdate({_id: bookingId},{
        //     status:'cancelled'
        // },{new:true});

        const existingBooking = await Booking.findOne({_id:bookingId});

        if(userRole!='customer'){
            return res.status(400).json({message:"Role is not customer"});
        }

        if(userId!=existingBooking.customerId.toString()){
            return res.status(400).json({message:"You are trying to delete someone else's booking. Not possible!"});
        }

        const updatedBooking = await Booking.findByIdAndUpdate({_id: bookingId},{
            status:'cancelled'
        },{new:true});

        return res.status(200).json({message:'Booking is updated successfully',booking:updatedBooking});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

module.exports = {createBooking, getProviderBookings, updateBookingStatus, getCustomerBookings, cancelBooking, getBookings};