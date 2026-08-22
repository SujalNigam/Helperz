import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import {
    getProviderSlots,
    updateSlotStatus
} from "../../api/slots";

function ManageSlots() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["providerSlots", id],
        queryFn: () => getProviderSlots(id)
    });

    const slotMutation = useMutation({
        mutationFn: ({ slotId, status }) =>
            updateSlotStatus(slotId, status),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["providerSlots", id]
            });
        },

        onError: (error) => {
            console.log(
                error.response?.data?.message ||
                "Failed to update slot"
            );
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading slots...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500">
                    Failed to load slots.
                </p>
            </div>
        );
    }

    const slots = data?.slots || [];

    const groupedSlotsByDate = {};

    for (const slot of slots) {
        const date = new Date(slot.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });

        if (!groupedSlotsByDate[date]) {
            groupedSlotsByDate[date] = [];
        }

        groupedSlotsByDate[date].push(slot);
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Manage Slots
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View and manage your availability.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/provider/services/${id}/generate-slots`,
                                {
                                    state: { from: "manage" }
                                }
                            )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white
                                   px-5 py-2.5 rounded-lg font-medium
                                   transition"
                    >
                        Update Availability
                    </button>

                </div>

                {/* Legend */}
                {slots.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl
                                    p-4 mb-6 flex flex-wrap gap-5">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Available
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            Booked
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                            Blocked
                        </div>

                    </div>
                )}

                {/* Empty State */}
                {slots.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-gray-200
                                    shadow-sm p-10 text-center">

                        <div className="text-5xl mb-4">
                            📅
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            No slots available
                        </h2>

                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            You haven't generated any availability for this
                            service yet. Configure your working days and
                            times to create slots.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/provider/services/${id}/generate-slots`,
                                    {
                                        state: { from: "manage" }
                                    }
                                )
                            }
                            className="mt-6 bg-blue-600 hover:bg-blue-700
                                       text-white px-6 py-2.5 rounded-lg
                                       font-medium transition"
                        >
                            Generate Slots
                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Upcoming Availability
                        </h2>

                        {Object.keys(groupedSlotsByDate).map(date => (

                            <div
                                key={date}
                                className="bg-white rounded-xl border
                                           border-gray-200 shadow-sm p-5"
                            >

                                {/* Date Header */}
                                <div className="flex items-center justify-between mb-4">

                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {date}
                                    </h3>

                                    <span className="text-sm text-gray-500">
                                        {groupedSlotsByDate[date].length}{" "}
                                        {groupedSlotsByDate[date].length === 1
                                            ? "slot"
                                            : "slots"}
                                    </span>

                                </div>

                                {/* Slots */}
                                <div className="flex flex-wrap gap-3">

                                    {groupedSlotsByDate[date].map(slot => (

                                        <div
                                            key={slot._id}
                                            className={`
                                                min-w-[130px]
                                                px-4 py-3
                                                rounded-lg
                                                border
                                                text-center
                                                ${
                                                    slot.status === "available"
                                                        ? "bg-green-50 border-green-200 text-green-700"
                                                        : slot.status === "booked"
                                                        ? "bg-red-50 border-red-200 text-red-700"
                                                        : "bg-gray-100 border-gray-200 text-gray-600"
                                                }
                                            `}
                                        >

                                            <p className="font-semibold">
                                                {slot.time}
                                            </p>

                                            <p className="text-sm mt-1 capitalize">
                                                {slot.status}
                                            </p>

                                            {/* Available → Block */}
                                            {slot.status === "available" && (
                                                <button
                                                    disabled={slotMutation.isPending}
                                                    onClick={() =>
                                                        slotMutation.mutate({
                                                            slotId: slot._id,
                                                            status: "blocked"
                                                        })
                                                    }
                                                    className="mt-2 text-xs font-medium
                                                               text-red-600 hover:text-red-700
                                                               disabled:opacity-50"
                                                >
                                                    Block
                                                </button>
                                            )}

                                            {/* Blocked → Unblock */}
                                            {slot.status === "blocked" && (
                                                <button
                                                    disabled={slotMutation.isPending}
                                                    onClick={() =>
                                                        slotMutation.mutate({
                                                            slotId: slot._id,
                                                            status: "available"
                                                        })
                                                    }
                                                    className="mt-2 text-xs font-medium
                                                               text-blue-600 hover:text-blue-700
                                                               disabled:opacity-50"
                                                >
                                                    Unblock
                                                </button>
                                            )}

                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default ManageSlots;