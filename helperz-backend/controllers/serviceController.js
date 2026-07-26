const Service = require('../models/Service');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const cloudinary = require("../config/cloudinary");

const createService = async (req, res) => {
    //get things from req

    try{
            console.log("Iam reqbody",req.body);
            console.log("Iam reqfile",req.file);
        const {title,icon,price,description} = req.body;
        const providerId = req.user.id;

        // if (!title || !icon || !price || !description) {
        //         return res.status(400).json({
        //             message: "All fields are required"
        //         });
        //     }
        
        if (!title || !price || !description) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }

        if (!req.file) {
                return res.status(400).json({
                    message: "Image is required"
                });
            }

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        // console.log(uploadResult);
        //set it to DB
        
        const service = await Service.create({
                title,
                // icon,
                image: {
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                },
                price,
                description,
                providerId
            });
    

    
        // console.log(service);
        return res.status(201).json({message:'Service created Successfully',service});

    }   
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    } 

}

const editService = async(req,res) => {

    try{
            console.log("Iam reqbody in edit",req.body);
            console.log("Iam reqfile in edit",req.file);
        // const {title,icon,price,description} = req.body;
        const {title,price,description} = req.body;
        const role = req.user.role;
        const loggedInProviderId = req.user.id;
        const serviceId = req.params.id;

       



        // if(!role){
        //     return res.status(400).json({message:'Token not provided!'});
        // }
        if(role!=='provider'){
            return res.status(403).json({message:'Only provider can edit service!'});
        }
        if(!serviceId){
            return res.status(400).json({message:'Service id could not reach Backend'});
        }
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
                return res.status(400).json({
                    message: "Invalid service id"
                });
            }

        // if(!title || !icon || !price || !description){
        if(!title || !price || !description){
            return res.status(400).json({message:'Data is missing somewhere!'});
        }

        const service = await Service.findById(serviceId);

        if(!service){
            return res.status(404).json({message:'Service not found in DB'});
        }

        const providerId = service.providerId.toString();

        if(providerId!==loggedInProviderId){
            return res.status(403).json({message:'You can only edit your services'});
        }
        
// -----------------------------
        let image = service.image;


    if(req.file){
        // await cloudinary.uploader.destroy(service.image.public_id);
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
                // image  = uploadResult.image;
                image = {
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                };
            }

        // ------------------------

        const updatedService = await Service.findByIdAndUpdate(serviceId,{
            title,
            // icon,
            image,
            price,
            description
        },{new:true});

        if (req.file) {
            try {
                await cloudinary.uploader.destroy(service.image.public_id);
            } catch (err) {
                console.log("Failed to delete old Cloudinary image:", err.message);
            }
        }

        return res.status(200).json({message:'Service edited successfully',service:updatedService});

        
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
}
const deleteService = async(req,res) => {

    try{
        
        const role = req.user.role;
        const loggedInProviderId = req.user.id;
        const serviceId = req.params.id;
        if(role!=='provider'){
            return res.status(403).json({message:'Only provider can edit service!'});
        }
        if(!serviceId){
            return res.status(400).json({message:'Service id could not reach Backend'});
        }
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
                return res.status(400).json({
                    message: "Invalid service id"
                });
            }


        const service = await Service.findById(serviceId);

        if(!service){
            return res.status(404).json({message:'Service not found in DB'});
        }

        const providerId = service.providerId.toString();

        if(providerId!==loggedInProviderId){
            return res.status(403).json({message:'You can only delete your services'});
        }
        
        const serviceBookings = await Booking.findOne({serviceId:serviceId});

        if (serviceBookings) {
                return res.status(400).json({
                    message: "This service has existing bookings and cannot be deleted."
                });
            }
        await cloudinary.uploader.destroy(service.image.public_id);
        const deletedService = await Service.findByIdAndDelete(serviceId);

        return res.status(200).json({message:'Service deleted successfully',service:deletedService});

    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}


const getServices = async(req,res)=> {
    try{
        //get services from DB
        const services = await Service.find();

        if (services.length === 0) {
                return res.status(200).json({
                    services: []
                }); 
                }

        return res.status(200).json({services:services, message:'Services fetched successfully'});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

const getServiceByID = async (req,res)=>{
    try{
        const serviceId = req.params.id;

        if(!serviceId){
            return res.status(400).json({message:'Service Id not reached to backend'});
        }
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
                return res.status(400).json({
                    message: "Invalid service id"
                });
            }

        const service = await Service.findById(serviceId);
        if(!service){
            return res.status(404).json({message:'Service not found in DB'});
        }
        return res.status(200).json({message:'Service fetched successfully',service});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

const getProviderServices = async (req, res) => {
    try {
        const providerId = req.user.id;
        const services = await Service.find({ providerId });

        if (services.length === 0) {
                return res.status(200).json({
                services: []
            });
            }
        
        return res.status(200).json({ services, message: 'Provider services fetched successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {createService,getServices,getServiceByID,getProviderServices, editService, deleteService};