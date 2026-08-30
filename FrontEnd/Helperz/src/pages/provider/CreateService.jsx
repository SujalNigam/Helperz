import React from 'react'
import { useForm } from 'react-hook-form';
// import { useParams } from 'react-router-dom';
// import { services } from '../../utils/dummyData';
import { useState } from 'react';
import { createService } from '../../api/services';
import { useNavigate } from "react-router-dom";


import { useQueryClient,useMutation } from '@tanstack/react-query';

function CreateService() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
// const [isCreated, setIsCreated] = useState(false);

const queryClient = useQueryClient();


const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
    defaultValues:{price:100}
});

const mutation = useMutation({
  mutationFn: createService,

  onSuccess: (data) => {
    queryClient.invalidateQueries(['providerServices']);

    const serviceId = data.service._id;

    navigate(`/provider/services/${serviceId}/generate-slots`, {
    state: { from: "create" }
});
  },

  onError: (error) => {
    console.log(error.message);
  }
});

    

    // const submitHandler = async (data) => {
    //   console.log(data);
    //   mutation.mutate(data);    
    // }


    const submitHandler = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    // formData.append("icon", data.icon);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    mutation.mutate(formData);
}



  
  return (
    <>
    <div className='flex flex-col justify-center items-center m-20'>
     <form className='border-2 rounded-sm w-fit border-gray-700 flex flex-col justify-center items-center gap-4 p-15 m-2 bg-amber-100' onSubmit={handleSubmit(submitHandler)}>
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='Enter Service Title: ' type='text' {...register("title", {required:'Title Name is required'})}/>
            {errors.title && <p>{errors.title.message}</p>}
            {/* <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='*' type='text' {...register("icon", {required:'Icon is required'})}/> */}
           {/* <label className="font-medium text-gray-700">
  Service Image
</label> */}

<input type="file" accept="image/*" {...register("image")} 
  className="w-full rounded-md border-2 border-gray-700 bg-white p-2
             file:mr-4 file:rounded-md file:border-0
             file:bg-gray-700 file:px-4 file:py-2
             file:text-white hover:file:bg-gray-800"
onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                    setPreview(URL.createObjectURL(file));
                    }
                    
                 }}/>

{errors.image && (
  <p className="text-red-600">{errors.image.message}</p>
)}

                  {
                    preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-md"
                    />
                    )
                  }

            {errors.icon && <p>{errors.icon.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' type='number' {...register("price", {required:'Price is required'})}/>
            {errors.price && <p>{errors.price.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='It is a service description' type='text' {...register("description", {required:'Description is required'})}/>
            {errors.description && <p>{errors.description.message}</p>}
            <button className='bg-gray-700 text-white p-2 m-4 rounded-md '  type='submit' > {mutation.isPending ? "Creating..." : "Create Service"}</button>
            
     </form>
     {/* {isCreated && mutation.isSuccess && <p className='text-green-600 text-xl'>Service Created Successfully! 🎉</p>} */}
     {mutation.isSuccess && <p className='text-green-600 text-xl'>Service Created Successfully! 🎉</p>}
     {mutation.isError && <p className='text-red-600'>Error: {mutation.error.message}</p>}
     </div>
     </>
  )
}

export default CreateService;