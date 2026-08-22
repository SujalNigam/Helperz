import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateSlots } from "../../api/slots";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import toast from "react-hot-toast";

function GenerateSlots() {
    const [workingDays, setWorkingDays] = useState([]);
    const [times, setTimes] = useState([]);
    const [newTime, setNewTime] = useState("");

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

    const toggleDay = (day) => {
        setWorkingDays((prevDays) => {
            if (prevDays.includes(day)) {
                return prevDays.filter((d) => d !== day);
            }

            return [...prevDays, day];
        });
    };

    const addTime = () => {
        if (!newTime) return;

        if (times.includes(newTime)) {
            toast.error("This time is already added.");
            return;
        }

        setTimes((prevTimes) =>
            [...prevTimes, newTime].sort()
        );

        setNewTime("");
    };

    const removeTime = (timeToRemove) => {
        setTimes((prevTimes) =>
            prevTimes.filter((time) => time !== timeToRemove)
        );
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
            toast.error("Add at least one time slot.");
            return;
        }

        generateMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Configure Availability
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Choose the days and times when customers can
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
                                const selected =
                                    workingDays.includes(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`py-3 px-3 rounded-lg border font-medium transition
                                            ${
                                                selected
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                            }
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8" />

                    {/* Times */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Available Times
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 mb-4">
                            Add the times customers can book.
                        </p>

                        {/* Add time */}
                        <div className="flex flex-col sm:flex-row gap-3">

                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) =>
                                    setNewTime(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-4 py-3
                                           text-gray-700 focus:outline-none
                                           focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={addTime}
                                className="bg-gray-800 hover:bg-gray-900
                                           text-white px-5 py-3 rounded-lg
                                           font-medium transition"
                            >
                                Add Time
                            </button>

                        </div>

                        {/* Selected times */}
                        {times.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-5">

                                {times.map((time) => (
                                    <div
                                        key={time}
                                        className="flex items-center gap-2
                                                   bg-blue-50 text-blue-700
                                                   border border-blue-200
                                                   px-3 py-2 rounded-full"
                                    >
                                        <span className="font-medium">
                                            {time}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTime(time)
                                            }
                                            className="text-blue-500 hover:text-red-500
                                                       font-bold"
                                            aria-label={`Remove ${time}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 mt-4">
                                No times added yet.
                            </p>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">
                                Availability period:
                            </span>{" "}
                            Slots will be generated for the next
                            <span className="font-semibold">
                                {" "}30 days
                            </span>{" "}
                            based on your selected working days and times.
                        </p>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="button"
                        disabled={generateMutation.isPending}
                        onClick={handleGenerate}
                        className={`w-full mt-6 py-3 rounded-lg text-white
                                   font-semibold transition
                                   ${
                                       generateMutation.isPending
                                           ? "bg-gray-400 cursor-not-allowed"
                                           : "bg-blue-600 hover:bg-blue-700"
                                   }
                        `}
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