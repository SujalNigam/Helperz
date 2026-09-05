import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import {useQuery} from '@tanstack/react-query';
import { getServices } from '../../api/services';
import { getCustomerBookings } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import { cancelBooking } from '../../api/bookings';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SkeletonServiceProviderCard from '../../components/SkeletonServiceProviderCard';
import SkeletonProviderBookingCard from '../../components/SkeletonProviderBookingCard';

function CustomerDashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const [servicePage, setServicePage]= useState(1);
    const limit = 4;
    
    const cancelMutation = useMutation({
        mutationFn:cancelBooking,
        onSuccess:()=>{
            queryClient.invalidateQueries(['bookings']);
            toast.success('Booking Cancelled Successfully');
        },
        onError:(error)=>{
            toast.error(error.response?.data?.message||'Booking cancellation failed!');
        }
    })

    const handleCancel = (id) => {
            cancelMutation.mutate(id);
        }
    
        

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['services',servicePage,limit],       // unique cache key
        queryFn:() => getServices(servicePage,limit),         // the function that fetches data
    });

    const { data:dataB, isLoading:isLoadingB, isError:isErrorB, error:errorB } = useQuery({
        queryKey: ['bookings',1],       // unique cache key
        queryFn: () => getCustomerBookings(1,2,'upcoming'),         // the function that fetches data
    });


  return (
    <>
        {/* customer's booked bookings  */}
        <div className='mb-2'>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>My Bookings</h2>
        
        <div className='flex gap-4 flex-wrap justify-center'>
        {   isLoadingB ? (<div className='flex gap-4 flex-wrap justify-center'>
                            {[1,2,3].map(i => <SkeletonProviderBookingCard key={i} />)}
                            </div>):
                            isErrorB ? (<p>Error: {errorB.message}</p>)
        : dataB?.bookings.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Upcoming Bookings yet</p>

                              <button
                                onClick={() => navigate("/customer/my-bookings",{
                                  state: {type: 'past'}
                                })
                                }
                                className="mt-5 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                              >
                                View Past Bookings →
                              </button>
                            </div>
        )
            :(<div className='flex flex-col justify-center'>
    <div className='flex flex-wrap gap-4 justify-center'>
        {dataB.bookings.map((booking) => (
            <BookingCard
                key={booking._id}
                booking={booking}
                showActions={false}
                showCancel={true}
                onCancel={handleCancel}
            />
        ))}
    </div>

    <div className="flex justify-center mt-6">
        <button
            onClick={() => navigate('/customer/my-bookings')}
            className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
            View All Bookings →
        </button>
    </div>
</div>
            )
        }
            </div>
        </div>

     {/* ----------------------Services showing-------------------- */}
        <div id='services'>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>Popular Services</h2>
        <div className='flex gap-4 flex-wrap justify-center'>
        {   isLoading ? (<div className='flex gap-4 flex-wrap justify-center'>
                            {[1,2,3,4].map(i => <SkeletonServiceProviderCard key={i} />)}
                            </div>)
        : isError ? (<p>Error: {error.message}</p>)
        :data.services.length === 0 ? (<div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Services yet</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Our Providers are soon going to provide best services.
                              </p>
                            </div>)
            :(<div className='flex flex-col gap-4 flex-wrap justify-center'>
                <div className='flex gap-4 flex-wrap justify-center'>
                    { data?.services.map((service)=>{
                return <Card key={service._id} service={service}/>
                        }) }
                </div>
                
                <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    disabled={servicePage === 1}
                    onClick={() => setServicePage(servicePage - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <span className="text-gray-700 font-medium">
                    Page {servicePage} of {data?.pagination?.totalPages || 0}
                </span>

                <button
                    disabled={!data?.pagination?.hasNextPage}
                    onClick={() => setServicePage(servicePage + 1)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            </div>
            )
        }
            </div>
        </div>

        

    </>
  )
}

export default CustomerDashboard