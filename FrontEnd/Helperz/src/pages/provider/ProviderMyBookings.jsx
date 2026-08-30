import React, { useState } from 'react';
import BookingCard from '../../components/BookingCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProviderBookings,updateBookingStatus } from '../../api/bookings';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import SkeletonProviderBookingCard from '../../components/SkeletonProviderBookingCard';

const ProviderMyBookings = () => {
    const location = useLocation();
    const [type, setType] = useState(
        location.state?.type || 'upcoming'
    );
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const {
    data,
    isLoading,
    isError,
    error
} = useQuery({
    queryKey: ['provider-my-bookings', type, page],
    queryFn: () => getProviderBookings(page, 3, type)
});

const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),

    onSuccess: (data, variables) => {
      console.log(variables.status);
      queryClient.invalidateQueries({
        queryKey: ['provider-my-bookings', type, page]
      });
      if(variables.status === 'accepted'){
        toast.success(`Booking ${variables.status}`);
      }
      else{
        toast(`Booking ${variables.status}`);
      }
    }
  });

  const handleStatusUpdate = (id, status) => {
    updateMutation.mutate({ id, status });
  };

    return (
        <div>
                <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>My Bookings</h2>
                
                <div className="flex justify-center gap-2 mb-6">
        <button
            onClick={() => {
                setType('upcoming');
                setPage(1);
            }}
            className={`px-5 py-2 rounded-lg font-medium ${
                type === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
            }`}
        >
            Upcoming
        </button>

        <button
            onClick={() => {
                setType('past');
                setPage(1);
            }}
            className={`px-5 py-2 rounded-lg font-medium ${
                type === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
            }`}
        >
            Past
        </button>
                </div>

            {/* {isLoading && <p>Loading...</p>} */}

            {isError && <p>Error: {error.message}</p>}

            {isLoading ? (
                <div className='flex gap-4 flex-wrap justify-center'>
                            {[1,2,3].map(i => <SkeletonProviderBookingCard key={i} />)}
                            </div>
            ):
            data.bookings.length === 0 ? (<div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Bookings yet</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Create a service to start receiving bookings.
                              </p>

                              <button
                                onClick={() => navigate("/provider/create-service")}
                                className="mt-5 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                              >
                                Create Service →
                              </button>
                            </div>):
            (
            <div>
                <div className='mb-2'>
                            
                        <div className='flex gap-4 flex-wrap justify-center'>
                        {   data.bookings.map((booking)=>{
                                return <BookingCard key={booking._id} booking={booking} showActions={true} showCancel={false} handleStatusUpdate={handleStatusUpdate}/>
                            }) 
                        }
                            </div>
                        </div>
                        {/* ---------------- */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <span className="text-gray-700 font-medium">
                    Page {page} of {data?.pagination?.totalPages || 0}
                </span>

                <button
                    disabled={!data?.pagination?.hasNextPage}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            
            
        </div>
            )}
           
    </div>
    );
};

export default ProviderMyBookings;