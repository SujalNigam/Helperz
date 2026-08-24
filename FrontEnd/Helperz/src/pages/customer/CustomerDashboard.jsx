import React from 'react'
import { useState } from 'react';
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
// import { services } from '../../utils/dummyData';
import {useQuery} from '@tanstack/react-query';
import { getServices } from '../../api/services';
import { getCustomerBookings } from '../../api/bookings';
import BookingCard from '../../components/BookingCard';
import { cancelBooking } from '../../api/bookings';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';


function CustomerDashboard() {
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const savedUser = useAuthStore((state)=>state.user);

    // const logoutHandler = () => {
    //     useAuthStore.getState().logout();
    //     // localStorage.clear();
    //     navigate('/login');
    // }

    
    const cancelMutation = useMutation({
        mutationFn:cancelBooking,
        onSuccess:()=>{
            queryClient.invalidateQueries(['bookings']);
            toast.success('Booking Cancelled Successfully');
        },
        onError:(error)=>{
            // console.log(error.message);
            toast.error(error.response?.data?.message||'Booking cancellation failed!');
        }
    })

    const handleCancel = (id) => {
            // const b = await cancelBooking(id);
            cancelMutation.mutate(id);
            // console.log("request is cancelled", id);
        }
    
        

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['services'],       // unique cache key
        queryFn: getServices,         // the function that fetches data
    });
    const { data:dataB, isLoading:isLoadingB, isError:isErrorB, error:errorB } = useQuery({
        queryKey: ['bookings',1],       // unique cache key
        queryFn: () => getCustomerBookings(2,2),         // the function that fetches data
    });
    if (!savedUser) return <p>Loading...</p>;


  return (
    <>

    <h1 className='text-blue-600 text-2xl'>Hi {savedUser.name}! CustomerDashboard</h1>

    {/* <button onClick={logoutHandler}>LogOut</button> */}


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
        </div>




        {/* -------------------------Services Search------------------ */}
        <div>
            <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>
     {/* ----------------------Services showing-------------------- */}
        <div>
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


    </>
  )
}

export default CustomerDashboard