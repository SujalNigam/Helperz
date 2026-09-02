import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateSlots } from "../../api/slots";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function GenerateSlots() {
    const [workingDays, setWorkingDays] = useState([]);
    const [times, setTimes] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    // Fixed hourly start times
    const availableTimes = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00"
    ];

    const toggleDay = (day) => {
        setWorkingDays((prevDays) => {
            if (prevDays.includes(day)) {
                return prevDays.filter((d) => d !== day);
            }

            return [...prevDays, day];
        });
    };

    const toggleTime = (time) => {
        setTimes((prevTimes) => {
            if (prevTimes.includes(time)) {
                return prevTimes.filter((t) => t !== time);
            }

            return [...prevTimes, time].sort();
        });
    };

    const generateMutation = useMutation({
        mutationFn: () =>
            generateSlots(id, {
                workingDays,
                times
            }),

        onSuccess: (data) => {
            console.log(data);

            toast.success("Slots generated successfully!");

            if (location.state?.from === "manage") {
                navigate(`/provider/services/${id}/manage-slots`);
            } else {
                navigate("/provider/dashboard");
            }
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to generate slots"
            );
        }
    });

    const handleGenerate = () => {
        if (workingDays.length === 0) {
            toast.error("Select at least one working day.");
            return;
        }

        if (times.length === 0) {
            toast.error("Select at least one start time.");
            return;
        }

        generateMutation.mutate();
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");

        const date = new Date();
        date.setHours(Number(hour), Number(minute));

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Configure Availability
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Choose the days and start times when customers can
                        book this service.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">

                    {/* Working Days */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Working Days
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 mb-4">
                            Select the days you are available.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                            {days.map((day) => {
                                const selected = workingDays.includes(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`py-3 px-3 rounded-lg border font-medium transition ${
                                            selected
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8" />

                    {/* Start Times */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Start Times
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 mb-4">
                            Select the times customers can book.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                            {availableTimes.map((time) => {
                                const selected = times.includes(time);

                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => toggleTime(time)}
                                        className={`py-3 px-4 rounded-lg border font-medium transition ${
                                            selected
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                    >
                                        {formatTime(time)}
                                    </button>
                                );
                            })}

                        </div>

                        {/* Selected count */}
                        {times.length > 0 && (
                            <p className="text-sm text-gray-500 mt-4">
                                {times.length} start time
                                {times.length !== 1 ? "s" : ""} selected
                            </p>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">
                                Availability period:
                            </span>{" "}
                            Slots will be generated for the next{" "}
                            <span className="font-semibold">
                                30 days
                            </span>{" "}
                            based on your selected working days and start
                            times.
                        </p>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="button"
                        disabled={generateMutation.isPending}
                        onClick={handleGenerate}
                        className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition ${
                            generateMutation.isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {generateMutation.isPending
                            ? "Generating Slots..."
                            : "Generate 30 Days of Slots"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default GenerateSlots;