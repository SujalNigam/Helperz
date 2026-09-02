
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createBooking } from "../../api/bookings";
import { getServiceById } from "../../api/services";
import toast from "react-hot-toast";
import { getAvailableSlots } from "../../api/slots";

function Booking() {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: serviceData,
        isLoading: serviceLoading,
        isError: serviceIsError,
        error: serviceError
    } = useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id)
    });

    const {
        data: slotsData,
        isLoading: slotsLoading,
        isError: slotsIsError,
        error: slotsError
    } = useQuery({
        queryKey: ["slot", id],
        queryFn: () => getAvailableSlots(id)
    });

    const {
        register,
        handleSubmit,
        reset,
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
            toast.error(
                error.response?.data?.message || "Booking failed"
            );
        }
    });

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
    };

    if (serviceLoading || slotsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (serviceIsError || slotsIsError) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-red-500">
                    {serviceError?.response?.data?.message ||
                        slotsError?.response?.data?.message ||
                        "Something went wrong."}
                </p>
            </div>
        );
    }

    const groupedSlotsByDate = {};

    for (const slot of slots) {
        const date = new Date(slot.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        if (!groupedSlotsByDate[date]) {
            groupedSlotsByDate[date] = [];
        }

        groupedSlotsByDate[date].push(slot);
    }

    const selectedSlotData = slots.find(
        (slot) => slot._id === selectedSlot
    );

    return (
        <div className="flex flex-col items-center px-4 py-8">

            {/* Page Heading */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Book Your Service
                </h1>

                <p className="text-gray-500 mt-1">
                    Choose your details, date and preferred time
                </p>
            </div>

            <form
                className="w-full max-w-xl bg-white border border-gray-200
                           rounded-xl shadow-md p-6 sm:p-8 flex flex-col gap-6"
                onSubmit={handleSubmit(submitHandler)}
            >

                {/* Service Summary */}
                <div className="w-full flex gap-4 items-center p-4
                                bg-gray-50 rounded-lg border border-gray-200">

                    {service.image?.url ? (
                        <img
                            src={service.image.url}
                            alt={service.title}
                            className="w-24 h-24 sm:w-28 sm:h-28
                                       object-cover rounded-lg shrink-0"
                        />
                    ) : (
                        <div
                            className="w-24 h-24 sm:w-28 sm:h-28
                                       bg-gray-300 rounded-lg shrink-0
                                       flex items-center justify-center
                                       text-sm text-gray-500"
                        >
                            No Image
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="text-sm text-gray-500 mb-1">
                            Booking
                        </p>

                        <h2 className="text-xl font-bold text-gray-800
                                       wrap-break-word">
                            {service.title}
                        </h2>

                        <p className="text-green-700 font-bold mt-2">
                            ₹{service.price}
                        </p>
                    </div>
                </div>

                {/* Your Details */}
                <div className="space-y-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Your Details
                    </h2>

                    {/* Contact Name */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700 mb-1">
                            Contact Person
                        </label>

                        <input
                            className="w-full px-4 py-3 text-black bg-white
                                       border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-500"
                            placeholder="Enter contact person name"
                            type="text"
                            {...register("contactName", {
                                required: "Name is required"
                            })}
                        />

                        {errors.contactName && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.contactName.message}
                            </p>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700 mb-1">
                            Contact Number
                        </label>

                        <input
                            className="w-full px-4 py-3 text-black bg-white
                                       border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-500"
                            placeholder="+91 9876543210"
                            type="tel"
                            {...register("contactNumber", {
                                required: "Contact Number is required"
                            })}
                        />

                        {errors.contactNumber && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.contactNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700 mb-1">
                            Service Address
                        </label>

                        <input
                            className="w-full px-4 py-3 text-black bg-white
                                       border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-500"
                            placeholder="Enter service address"
                            type="text"
                            {...register("address", {
                                required: "Address is required"
                            })}
                        />

                        {errors.address && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.address.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Date & Time */}
                {slots.length === 0 ? (
                    <div className="p-4 rounded-lg bg-gray-50
                                    border border-gray-200 text-center">
                        <p className="text-gray-500">
                            No slots available for this service.
                        </p>
                    </div>
                ) : (
                    <div className="w-full space-y-6">

                        {/* Dates */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Choose a Date
                            </h2>

                            <div className="flex gap-3 flex-wrap">
                                {Object.keys(groupedSlotsByDate).map(
                                    (date) => (
                                        <button
                                            key={date}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedSlot(null);
                                            }}
                                            className={`px-4 py-3 rounded-lg border
                                                font-medium transition ${
                                                selectedDate === date
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                            }`}
                                        >
                                            {date}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Times */}
                        {selectedDate && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                    Available Times
                                </h2>

                                <div className="flex flex-wrap gap-3">
                                    {groupedSlotsByDate[selectedDate].map(
                                        (slot) => (
                                            <button
                                                key={slot._id}
                                                type="button"
                                                disabled={
                                                    bookingMutation.isPending
                                                }
                                                onClick={() =>
                                                    setSelectedSlot(slot._id)
                                                }
                                                className={`px-4 py-2 rounded-lg
                                                    border transition ${
                                                    selectedSlot === slot._id
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                                }`}
                                            >
                                                {slot.time}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* Booking Summary */}
                {selectedSlotData && (
                    <div className="w-full p-4 rounded-lg bg-green-50
                                    border border-green-200">

                        <p className="text-sm text-gray-500">
                            Selected Slot
                        </p>

                        <p className="mt-1 font-semibold text-green-700">
                            {new Date(
                                selectedSlotData.date
                            ).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short"
                            })}{" "}
                            at {selectedSlotData.time}
                        </p>

                        <div className="flex justify-between items-center
                                        mt-3 pt-3 border-t
                                        border-green-200">

                            <span className="text-gray-600">
                                Total
                            </span>

                            <span className="text-xl font-bold text-green-700">
                                ₹{service.price}
                            </span>
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={bookingMutation.isPending}
                    className={`w-full py-3 rounded-lg font-semibold
                                text-white transition ${
                        bookingMutation.isPending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {bookingMutation.isPending
                        ? "Booking..."
                        : "Confirm Booking"}
                </button>

            </form>
        </div>
    );
}

export default Booking;

