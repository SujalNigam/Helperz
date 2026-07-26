import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom';
// import { services } from '../utils/dummyData';
import { useNavigate } from 'react-router-dom';
import { getServiceById } from '../api/services'
import useAuthStore from '../store/authStore';
function ServiceDetail() {
    const role = useAuthStore((state)=>state.role);
    const navigate = useNavigate();
    const user = useAuthStore((state)=>state.user);

    console.log("Hi");
    const { id } = useParams();

    const {data, isLoading, isError, error} = useQuery({
        queryKey:['service',id],
        queryFn:() => getServiceById(id)
    });

    const handleBookNow = () => { 
                if(!user){
                    navigate(`/login`,{state:{from:`/booking/${id}`}});
                }
                else{
                    navigate(`/booking/${id}`);
                }
            }

    // const service =  services.find((s)=>s.id==id)
    // console.log(service);
  return (
    ( isLoading ? (<p>Loading...</p>)
        :( isError ? (<p>Error: {error?.response?.data?.message || error.message}</p>)
        :(<div className='flex justify-center items-center m-20'>
            <div className=' w-fit flex flex-col items-center justify-center p-10 gap-4 rounded-md border-2 border-amber-800 '>
            {/* <p className='text-6xl'>{data.service.icon}</p> */}
                            {data.service.image.url ? (
                        <img
                            src={data.service.image.url}
                            alt={data.service.title}
                            className="w-full h-40 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-lg">
                            No Image
                        </div>
                    )} 
            <h1 className='text-3xl font-bold'>{data.service.title}</h1>
            <p className='text-gray-500'>{data.service.description}</p>
            <p className='text-green-600 text-2xl font-bold'>{data.service.price}</p>
            {

               role==='provider' ? (<>
                    <button onClick={(e)=>{
                    e.stopPropagation();
                    onDelete(data.service._id)}
                    }
                    className='bg-red-600 rounded text-white p-1 text-sm m-1'>Delete</button> 

                    <button onClick={(e)=>{
                    e.stopPropagation();
                    navigate(`/services/editService/${data.service._id}`);
                    }}
                    className='bg-blue-600 rounded text-white p-1 text-sm m-1' >
                    Edit Service
                    </button>
                            </>):
                        (<button onClick={handleBookNow} className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800'>Book Now</button>)
            }
        </div>
        </div>)
        
        )
  )
)
}

export default ServiceDetail