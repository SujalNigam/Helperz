import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
// import { services } from '../../utils/dummyData';
// import { useState } from 'react';
import { useQuery,useMutation } from '@tanstack/react-query';
import { createBooking } from '../../api/bookings';
import { getServiceById } from '../../api/services';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function Booking() {
// const service = services.find(service => service.id == id);
// const [isBooked, setIsBooked] = useState(false);

const {id} = useParams();
const navigate = useNavigate();

const {data, isLoading, isError, error} = useQuery({
    queryKey:['service', id],
    queryFn:() => getServiceById(id)
});



// console.log(data);

const {
  register,
  handleSubmit,reset,
  formState: { errors }
} = useForm();


const service = data.service;


// ------------
// console.log(service);

const bookingMutation = useMutation({
    mutationFn: createBooking,
    
      onSuccess: () => {
        toast.success("Booking created successfully!");
        reset();
        navigate("/customer/dashboard"); // if you're redirecting
    },
    onError: (error) => {
        toast.error(error.response?.data?.message || "Booking failed");
    }
})


const submitHandler = (data) => {
    console.log(data);
    data = {...data, serviceId:id, }
    data = {...data, providerId: service.providerId, price: service.price};
    bookingMutation.mutate(data);
    // const booking = await createBooking(data);
    // setIsBooked(true);
}

if(isLoading){
    return <p>Loading...</p>
}
if(isError){
    return <p>Error:{error.message}...</p>
}


  return (
    <>
   <div className='flex flex-col justify-center items-center'>
      <form className='border-2 rounded-sm w-fit border-gray-700 flex flex-col justify-center items-center gap-4 p-15 m-2 bg-amber-100' onSubmit={handleSubmit(submitHandler)}>
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='Enter Your Name: ' type='text' {...register("name", {required:'Name is required'})}/>
            {errors.name && <p>{errors.name.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='+0123456789' type='tel' {...register("contact", {required:'Contact Number is required'})}/>
            {errors.contact && <p>{errors.contact.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='Las Vegas, US.' type='text' {...register("address", {required:'Address is required'})}/>
            {errors.address && <p>{errors.address.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' type='datetime-local' {...register("time", {required:'Date and Time is required'})}/>
            {errors.time && <p>{errors.time.message}</p>}
            <p className='text-green-800 text-2xl font-bold bg-gray-100 p-3'>{service.price}</p>
            {/* {errors.price && <p>{errors.price.message}</p>} */}
        
        <button type="submit"
        disabled={bookingMutation.isPending}
        className={`px-4 py-2 rounded text-white ${
            bookingMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
        {bookingMutation.isPending ? "Booking..." : "Book Now"}
    </button>
     </form>
     {bookingMutation.isSuccess && <p className='text-green-600 text-xl'>Booking Confirmed! 🎉</p>}
     </div>
     </>
  )
}

export default Booking