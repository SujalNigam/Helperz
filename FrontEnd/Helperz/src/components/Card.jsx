import React from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteService } from '../api/services';

function Card({service,showDelete,onDelete,showEdit}) {
   
    const navigate = useNavigate();
  return (
    <div  onClick={()=>navigate(`/services/${service._id}`)} className="
    rounded-md
    flex flex-col justify-center items-center
    border-2 border-amber-800
    min-w-30
    max-w-60
    bg-white
    px-3 py-3
    cursor-pointer
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-xl
  ">

        {/* <p>{service.id}</p>    */}
        {/* <p>{service.icon}</p>   */}
        {service.image.url ? (
            <img
                src={service.image.url}
                alt={service.title}
                className="w-full h-40 object-cover rounded-lg"
            />
        ) : (
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-lg">
                No Image
            </div>
        )} 
        <p className='font-semibold line-clamp-1 wrap-anywhere'>{service.title}</p>   
        <p className="font-semibold text-green-700">
          ₹{service.price}
        </p>  
        { showDelete && <button onClick={(e)=>{
          e.stopPropagation();
          onDelete(service._id)}
          }
        className='bg-red-600 rounded text-white p-1 text-sm m-1'>Delete</button> }
        {showEdit && <button onClick={(e)=>{
          e.stopPropagation();
          navigate(`/services/editService/${service._id}`);
        }}
        className='bg-blue-600 rounded text-white p-1 text-sm m-1' >
          Edit Service
        </button>}
    </div>
  )
}

export default Card;