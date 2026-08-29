import React from 'react'
import { useState } from 'react';
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import {useQuery} from '@tanstack/react-query';
import { getServices } from '../../api/services';
import { getCustomerBookings } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import { cancelBooking } from '../../api/bookings';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';


function CustomerDashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    // const navigate = useNavigate();
    const savedUser = useAuthStore((state)=>state.user);
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
    if (!savedUser) return <p>Loading...</p>;


  return (
    <>
        {/* customer's booked bookings  */}
        <div className='mb-2'>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>My Bookings</h2>
        <div className='flex gap-4 flex-wrap justify-center'>
        {   isLoadingB ? (<p>Loading...</p>)
        : (isErrorB ? (<p>Error: {errorB.message}</p>)
            :( dataB.bookings.map((booking)=>{
                return <BookingCard key={booking._id} booking={booking} showActions={false} showCancel={true} onCancel={handleCancel}/>
            }) ))
        }
            </div>
            <div className="flex justify-center mt-4">
                <button
                    className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => navigate('/customer/my-bookings')}
                >
                    View All Bookings →
                </button>
            </div>
        </div>

     {/* ----------------------Services showing-------------------- */}
        <div id='services'>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>Popular Services</h2>
        <div className='flex gap-4 flex-wrap justify-center'>
        {   isLoading ? (<p>Loading...</p>)
        : (isError ? (<p>Error: {error.message}</p>)
            :( data.services.map((service)=>{
                return <Card key={service._id} service={service}/>
            }) ))
        }
            </div>
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

    </>
  )
}

export default CustomerDashboard