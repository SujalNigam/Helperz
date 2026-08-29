import React from 'react'
import { useState } from "react";

import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery,useMutation } from '@tanstack/react-query';
import { createBooking } from '../../api/bookings';
import { getServiceById } from '../../api/services';
import toast from 'react-hot-toast';
import { getAvailableSlots } from '../../api/slots';


function Booking() {
const [selectedSlot, setSelectedSlot] = useState(null);
const [selectedDate, setSelectedDate] = useState(null);
const {id} = useParams();
const navigate = useNavigate();

const {data:serviceData, isLoading:serviceLoading, isError:serviceIsError, error:serviceError} = useQuery({
    queryKey:['service', id],
    queryFn:() => getServiceById(id)
});
const {data:slotsData, isLoading:slotsLoading, isError:slotsIsError, error:slotsError} = useQuery({
    queryKey:['slot', id],
    queryFn: () => getAvailableSlots(id)
});

const {
  register,
  handleSubmit,reset,
  formState: { errors }
} = useForm();


const service = serviceData?.service;
const slots = slotsData?.slots || [];

const bookingMutation = useMutation({
    mutationFn: createBooking,
    
      onSuccess: () => {
        toast.success("Booking created successfully!");
        reset();
        setSelectedSlot(null);
        setTimeout(() => {
            navigate("/customer/dashboard");
        }, 1000);
    },
    onError: (error) => {
        toast.error(error.response?.data?.message || "Booking failed");
    }
})


const submitHandler = (data) => {
     if (!selectedSlot) {
        toast.error("Please select a slot.");
        return;
    }

    bookingMutation.mutate({
        slotId: selectedSlot,
        contactName: data.contactName,
        address: data.address,
        contactNumber: data.contactNumber
    });
}
if (serviceLoading || slotsLoading) {
    return <p>Loading...</p>;
}
if (serviceIsError || slotsIsError) {
    return <p>Something went wrong.</p>;
}

    const groupedSlotsByDate = {};

    for(const slot of slots){

        const date = new Date(slot.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });

        if(!groupedSlotsByDate[date]){
            groupedSlotsByDate[date]=[];
        }
        groupedSlotsByDate[date].push(slot);
    }
    const selectedSlotData = slots.find(
            slot => slot._id === selectedSlot
        );


  return (
    <>
   <div className='flex flex-col justify-center items-center'>
      <form
    className="border-2 rounded-lg w-full max-w-xl border-gray-700
               flex flex-col gap-5 p-8 m-2 bg-amber-100"
    onSubmit={handleSubmit(submitHandler)}
>
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder="Contact Person Name" type='text' {...register("contactName", {required:'Name is required'})}/>
            {errors.contactName && <p>{errors.contactName.message}</p>}

            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='+0123456789' type='tel' {...register("contactNumber", {required:'Contact Number is required'})}/>
            {errors.contact && <p>{errors.contact.message}</p>}

            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='Las Vegas, US.' type='text' {...register("address", {required:'Address is required'})}/>
            {errors.address && <p>{errors.address.message}</p>}
            
            {slots.length === 0 ? (
    <p className="text-gray-500">
        No slots available.
    </p>
) : (
    <div className="w-full space-y-5">

        {/* Dates */}
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Choose a date
            </h2>

            <div className="flex gap-3 flex-wrap pb-2">
                {Object.keys(groupedSlotsByDate).map(date => (
                    <button
                        key={date}
                        type="button"
                        onClick={() => {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                        }}
                        className={`min-w-[100px] px-4 py-3 rounded-lg border ${
                            selectedDate === date
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                        }`}
                    >
                        {date}
                    </button>
                ))}
            </div>
        </div>

        {/* Times */}
        {selectedDate && (
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Available times
                </h2>

                <div className="flex flex-wrap gap-3">
                    {groupedSlotsByDate[selectedDate].map(slot => (
                        <button
                            key={slot._id}
                            type="button"
                            disabled={bookingMutation.isPending}
                            onClick={() => setSelectedSlot(slot._id)}
                            className={`px-4 py-2 rounded-lg border ${
                                selectedSlot === slot._id
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                            }`}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>
            </div>
        )}

    </div>
)}
            <p className='text-green-800 text-2xl font-bold bg-gray-100 p-3'> ₹{service.price}</p>

            
            {selectedSlotData && (
    <div className="w-full p-4 rounded-lg bg-green-50 border border-green-200">
        <p className="text-sm text-gray-500">
            Selected Slot
        </p>

        <p className="mt-1 font-semibold text-green-700">
            {new Date(selectedSlotData.date).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
            })}{" "}
            at {selectedSlotData.time}
        </p>
    </div>
)}
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
     </div>
     </>
  )
}

export default Booking