import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/services";
import Card from "../components/Card";
import SkeletonServiceProviderCard from "../components/SkeletonServiceProviderCard";

function AllServices() {
    const [servicePage, setServicePage] = useState(1);

    // More services per page since this is a dedicated page
    const limit = 12;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["services", servicePage, limit],
        queryFn: () => getServices(servicePage, limit),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    All Services
                </h1>

                <div className="flex gap-4 flex-wrap justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <SkeletonServiceProviderCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-center mt-10 text-red-600">
                Error: {error?.response?.data?.message || error.message}
            </p>
        );
    }

    return (
        <div id="services" className="min-h-screen bg-gray-50 px-4 py-10">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    All Services
                </h1>

                <p className="text-gray-500 mt-2">
                    Explore services offered by our providers.
                </p>
            </div>

            {data?.services?.length === 0 ? (
                <div className="flex flex-col justify-center items-center p-8">
                    <p className="text-gray-700 font-medium">
                        No Services Available
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Our providers are soon going to provide more services.
                    </p>
                </div>
            ) : (
                <>
                    {/* Services */}
                    <div className="flex gap-4 flex-wrap justify-center">
                        {data.services.map((service) => (
                            <Card
                                key={service._id}
                                service={service}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-10">

                        <button
                            disabled={servicePage === 1}
                            onClick={() =>
                                setServicePage((prev) => prev - 1)
                            }
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <span className="text-gray-700 font-medium">
                            Page {servicePage} of{" "}
                            {data?.pagination?.totalPages || 0}
                        </span>

                        <button
                            disabled={!data?.pagination?.hasNextPage}
                            onClick={() =>
                                setServicePage((prev) => prev + 1)
                            }
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default AllServices;