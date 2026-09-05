const Service = require('../models/Service');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const cloudinary = require("../config/cloudinary");

const createService = async (req, res) => {

    try{
           
        const {title,icon,price,description} = req.body;
        const providerId = req.user.id;

        
        
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
    

    
       
        return res.status(201).json({message:'Service created Successfully',service});

    }   
    catch(error){
        return res.status(500).json({message:error.message});
    } 

}

const editService = async(req,res) => {

    try{
        
        
        const {title,price,description} = req.body;
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
        

        let image = service.image;


    if(req.file){

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
          
                image = {
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                };
            }

     

const updatedService = await Service.findByIdAndUpdate(serviceId,{
            title,
            image,
            price,
            description
        },{new:true});

        if (req.file) {
            try {
                await cloudinary.uploader.destroy(service.image.public_id);
            } catch (err) {
                return res.status(500).json({message:'Image Upload Error'});
            }
        }

        return res.status(200).json({message:'Service edited successfully',service:updatedService});

        
    }
    catch(error){
       
        return res.status(500).json({message:error.message});
    }
}
const deleteService = async(req,res) => {

    try{
        
        const role = req.user.role;
        const loggedInProviderId = req.user.id;
        const serviceId = req.params.id;
        if(role!=='provider'){
            return res.status(403).json({message:'Only provider can delete service!'});
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
        const {limit = 4, page = 1} = req.query;
        const limitNumber = Number(limit);
        const pageNumber = Number(page);
        const skip = (pageNumber - 1) * limitNumber;
       
        const result = await Service.aggregate([
            {
                $facet: {
                    totalServices: [
                        {
                            $count: 'total'
                        }
                    ],
                    data: [
                    {
                    $sort: {
                        createdAt: -1
                    },
                        },
                        {
                                $skip: skip
                        },
                        {
                                $limit: limitNumber
                        }
                                ]
                            }
                        }
            
        ]);

         const totalServices = result[0].totalServices[0]?.total || 0;

    const services = result[0].data;

    const totalPages = Math.ceil(totalServices / limitNumber);

    const hasNextPage = pageNumber < totalPages;

    


        


        return res.status(200).json({services:services, message:'Services fetched successfully',
            pagination: {
                currentPage:pageNumber,
                totalPages,
                totalServices,
                hasNextPage
            }
        });
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
        const {limit = 4, page = 1} = req.query;
        const limitNumber = Number(limit);
        const pageNumber = Number(page);
        const skip = (pageNumber - 1) * limitNumber;
        const result = await Service.aggregate([
            {
                $match: {
                    providerId: new mongoose.Types.ObjectId(providerId)
                }
            },
            {
                $facet: {
                    totalServices: [
                        {
                            $count: 'total'
                        }
                    ],
                    data: [
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limitNumber
                        }
                    ]
                }
            }
        ]);

        const totalServices = result[0].totalServices[0]?.total || 0;

    const services = result[0].data;

    const totalPages = Math.ceil(totalServices / limitNumber);

    const hasNextPage = pageNumber < totalPages;

   

        
        
        return res.status(200).json({ services, message: 'Provider services fetched successfully',
            pagination: {
        currentPage:pageNumber,
        totalPages,
        totalServices,
        hasNextPage
    }
         });
    } catch (error) {
   
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {createService,getServices,getServiceByID,getProviderServices, editService, deleteService};