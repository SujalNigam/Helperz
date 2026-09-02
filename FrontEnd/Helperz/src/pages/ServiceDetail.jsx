import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getServiceById } from '../api/services'
import { deleteService } from '../api/services';
import { useQuery,useQueryClient, useMutation } from '@tanstack/react-query';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';



function ServiceDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

const [showModal, setShowModal] = useState(false);

const deleteMutation = useMutation({
    mutationFn: () => deleteService(id),

    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['providerServices']
        });

        setShowModal(false);

        toast.success('Service deleted Successfully');

        navigate('/provider/dashboard');
    },

    onError: (error) => {
        toast.error(
            error.response?.data?.message || 'Failed to delete service'
        );

        setShowModal(false);
    }
});



    const role = useAuthStore((state)=>state.role);

    const navigate = useNavigate();

    const user = useAuthStore((state)=>state.user);



    // console.log("Hi");




    const {data, isLoading, isError, error} = useQuery({

        queryKey:['service',id],

        queryFn:() => getServiceById(id)

    });



    const isOwner = data?.service?.providerId === user?._id;



    const handleBookNow = () => { 

                if(!user){

                    navigate(`/login`,{state:{from:`/booking/${id}`}});

                }

                else{

                    navigate(`/booking/${id}`);

                }

            }







 return (

  <>

    {isLoading ? (

      <p className="text-center mt-10 text-gray-600">Loading...</p>

    ) : isError ? (

      <p className="text-center mt-10 text-red-600">

        Error: {error?.response?.data?.message || error.message}

      </p>

    ) : (

      <div className="flex justify-center items-center px-4 pt-16 pb-10">

        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-md p-8 flex flex-col gap-5">



          {/* Image */}

          {data.service.image?.url ? (

            <img

              src={data.service.image.url}

              alt={data.service.title}

              className="w-full h-64 object-contain rounded-lg bg-gray-50"

            />

          ) : (

            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500">

              No Image

            </div>

          )}



          {/* Title */}

          <h1 className="text-3xl font-bold text-gray-800 wrap-anywhere">

            {data.service.title}

          </h1>



          {/* Description */}

          <p className="text-gray-600 leading-relaxed wrap-anywhere">

            {data.service.description}

          </p>



          {/* Price */}

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">

            <span className="text-gray-500 font-medium">

              Service Price

            </span>



            <span className="text-2xl font-bold text-green-600">

              ₹{data.service.price}

            </span>

          </div>



          {/* Provider Actions */}

          {role === "provider" && isOwner ? (

            <div className="flex flex-wrap gap-3 pt-2">



              <button
  onClick={(e) => {
    e.stopPropagation();
    setShowModal(true);
  }}
  className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium"
>
  Delete
</button>



              <button

                onClick={(e) => {

                  e.stopPropagation();

                  navigate(

                    `/provider/services/${data.service._id}/manage-slots`

                  );

                }}

                className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium"

              >

                Manage Slots

              </button>



              <button

                onClick={(e) => {

                  e.stopPropagation();

                  navigate(

                    `/services/editService/${data.service._id}`

                  );

                }}

                className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"

              >

                Edit Service

              </button>



            </div>

          ) :(

            <button

              onClick={handleBookNow}

              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"

            >

              Book Now

            </button>

          )}



        </div>

      </div>

    )}

     <ConfirmModal
      isOpen={showModal}
      title="Delete Service"
      message="This action cannot be undone."
      onCancel={() => setShowModal(false)}
      onConfirm={() => deleteMutation.mutate()}
      isLoading={deleteMutation.isPending}
    />

  </>

);

}



export default ServiceDetail