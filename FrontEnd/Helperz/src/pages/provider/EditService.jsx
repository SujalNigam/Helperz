import React, { useState,useEffect } from 'react'
import { getServiceById } from '../../api/services'
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query'
// import { data } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { editService } from '../../api/services';
import toast from 'react-hot-toast';

// ------------------------------------------------------

// const [preview, setPreview] = useState(null);



// {preview && (
//   <img
//     src={preview}
//     alt="Preview"
//     className="w-48 h-32 object-cover rounded-md"
//   />
// )}
// ----------------------------------------------


function EditService() {
    const [preview, setPreview] = useState(null);
    const {id} = useParams();
    const {register,handleSubmit,reset,formState:{errors}} = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const {data:dataS, isLoading:isLoadingS, isError:isErrorS, error: errorS} = useQuery({
        queryKey:['service',id],
        queryFn:()=>getServiceById(id)
    })

    useEffect(() => {
        if (dataS?.service) {
            reset(dataS.service);
            setPreview(dataS.service.image.url)
        } }, [dataS, reset]);
// --------------------------------------------------------
       

// --------------------------------------------------------
    const updateMutation = useMutation({
        mutationFn: (data) => editService(id,data),
        // mutationFn: (formData) => editService(id,formData),
        onSuccess:() => {
            queryClient.invalidateQueries({
            queryKey:['service',id]
        });
         queryClient.invalidateQueries({
            queryKey:['providerServices']
        });
        toast.success('Service Edited Successfully');
        navigate('/provider/dashboard');
    },
    onError: (error) => {
    console.log("Backend message:", error.response?.data?.message);

    toast.error(
        error.response?.data?.message || error.message
    );
}
    
    })
    
    if(isLoadingS){
        return <p>Loading...</p>
    }
    if(isErrorS){
        console.log(errorS.message);
        return <p>Error {errorS.message}</p>
    }


    
    console.log(dataS);
    
    const submitHandler = (formData) => {
         const formUpdatedData = new FormData();
        formUpdatedData.append('title',formData.title);
        if(formData?.image?.[0]){
            formUpdatedData.append('image',formData.image[0]);
        }
        formUpdatedData.append('price',formData.price);
        formUpdatedData.append('description',formData.description);
        // console.log(formData);
        // updateMutation.mutate(formData);
        // console.log('formData:',formUpdatedData);
        for (const pair of formUpdatedData.entries()) {
                console.log(pair[0], pair[1]);
            }
        updateMutation.mutate(formUpdatedData);
        
    }

  return (
    <>
    <div className='flex flex-col m-20 justify-center items-center'>
     <form className='border-2 rounded-sm w-fit border-gray-700 flex flex-col justify-center items-center gap-4 p-15 m-2 bg-amber-100' 
     onSubmit={handleSubmit(submitHandler)}
     >
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='Enter Service Title: ' type='text' {...register("title", {required:'Title Name is required'})}/>
            {errors.title && <p>{errors.title.message}</p>}
            {/* <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='*' type='text' {...register("icon", {required:'Icon is required'})}/>
            {errors.icon && <p>{errors.icon.message}</p>} */}

            <input type="file" accept="image/*" {...register("image")} onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                    setPreview(URL.createObjectURL(file));
                    }
                    
                 }}/>

                {
                    preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-md"
                    />
                    )
                }

            <input className='text-black border-b-2 border-gray-400 rounded-sm' type='number' {...register("price", {required:'Price is required'})}/>
            {errors.price && <p>{errors.price.message}</p>}
            <input className='text-black border-b-2 border-gray-400 rounded-sm' placeholder='It is a service description' type='text' {...register("description", {required:'Description is required'})}/>
            {errors.description && <p>{errors.description.message}</p>}
            <button type='submit'>Submit</button>
     </form>
     {/* {mutation.isSuccess && <p className='text-green-600 text-xl'>Service Created Successfully! 🎉</p>}
     {mutation.isError && <p className='text-red-600'>Error: {mutation.error.message}</p>} */}
     </div>
     </>
  )
}

export default EditService


