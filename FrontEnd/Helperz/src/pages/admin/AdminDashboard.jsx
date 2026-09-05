import {useQuery} from '@tanstack/react-query'
import UserCard from '../../components/UserCard';
import Card from '../../components/Card';
import BookingCard from '../../components/BookingCard';
import { getUsers,blockUnblockUser} from '../../api/users';
import { getServices } from '../../api/services';
import {getBookings} from '../../api/bookings';
import { useMutation,useQueryClient } from '@tanstack/react-query';

function AdminDashboard() {

    const {data:dataU, isLoading:isLoadingU, isError:isErrorU, error:errorU} = useQuery({
        queryKey:['users'],
        queryFn:getUsers
    })

    const {data:dataS, isLoading:isLoadingS, isError:isErrorS, error:errorS} = useQuery({
        queryKey:['services'],
        queryFn:getServices
    })

    const {data:dataB, isLoading:isLoadingB, isError:isErrorB, error:errorB} = useQuery({
        queryKey:['bookings'],
        queryFn:getBookings
    })

    
    const queryClient = useQueryClient();
    
    const userBlockMutation = useMutation({
        mutationFn:blockUnblockUser,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['users']
            });
        }
    })

    const handleToggleBlock = (id) => {
        userBlockMutation.mutate(id);
    }
    
    
    
    if(isLoadingB || isLoadingS || isLoadingU ){
        return <p>Loading...</p>
    }
    if(isErrorB){
        return <p>Error: {errorB.message}</p>
    }
    if(isErrorS){
        return <p>Error: {errorS.message}</p>
    }
    if(isErrorU){
        return <p>Error: {errorU.message}</p>
    }
    
    const users = dataU.users;
    const services = dataS.services;
    const bookings = dataB.bookings;
    
    

  return (
    <>
    {/* ----------usersList--------------- */}
    <div className='flex flex-col items-center justify-center py-4'>
        <h1 className='text-2xl text-black font-bold'>All Users List</h1>
        <div className='flex justify-center items-center gap-10 py-5'>
            {
                users.map((user)=><UserCard onToggle={handleToggleBlock} key={user._id} user={user}/>)
            }
        </div>
    </div>
        


        {/* ------------ServicesList----------- */}
    <div className='flex flex-col items-center justify-center py-4'>
        <h1 className='text-2xl text-black font-bold'>All Services List</h1>
         <div className='flex justify-center items-center gap-10 py-5'>
            {
                services.map((service)=><Card key={service._id} service={service}/>)
            }
        </div>

    </div>

        {/* ----------------BookingList------------- */}

    <div className='flex flex-col items-center justify-center py-4'>
        <h1 className='text-2xl text-black font-bold'>All Bookings List</h1>
         <div className='flex flex-wrap justify-center items-center gap-10 py-5'>
            {
                bookings.map((booking)=><BookingCard showActions={false} key={booking._id} booking={booking}/>)
            }
        </div>
    </div>
    </>
  )
}

export default AdminDashboard