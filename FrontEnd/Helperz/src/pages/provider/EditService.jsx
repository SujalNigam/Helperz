import React, { useState, useEffect } from 'react'
import { getServiceById, editService } from '../../api/services'
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function EditService() {
  const [preview, setPreview] = useState(null);
  const { id } = useParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: dataS,
    isLoading: isLoadingS,
    isError: isErrorS,
    error: errorS
  } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id)
  });

  useEffect(() => {
    if (dataS?.service) {
      reset(dataS.service);
      setPreview(dataS.service.image?.url || null);
    }
  }, [dataS, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => editService(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service', id]
      });

      queryClient.invalidateQueries({
        queryKey: ['providerServices']
      });

      toast.success('Service Edited Successfully');
      navigate('/provider/dashboard');
    },

    onError: (error) => {
      console.log(
        "Backend message:",
        error.response?.data?.message
      );

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  });

  if (isLoadingS) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (isErrorS) {
    return (
      <p className="text-center mt-10 text-red-600">
        Error: {errorS.message}
      </p>
    );
  }

  const submitHandler = (formData) => {
    const formUpdatedData = new FormData();

    formUpdatedData.append('title', formData.title);

    if (formData?.image?.[0]) {
      formUpdatedData.append('image', formData.image[0]);
    }

    formUpdatedData.append('price', formData.price);
    formUpdatedData.append('description', formData.description);

    updateMutation.mutate(formUpdatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-xl bg-white border border-gray-200
                   rounded-xl shadow-md p-8
                   flex flex-col gap-5"
      >

        {/* Heading */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Service
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Update the details of your service
          </p>
        </div>


        {/* Service Title */}
        <div className="w-full">
          <label className="block font-semibold text-gray-700 mb-2">
            Service Title
          </label>

          <input
            type="text"
            placeholder="e.g. Home Cleaning"
            className="w-full text-black border border-gray-400
                       rounded-lg p-3
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500"
            {...register("title", {
              required: "Title is required"
            })}
          />

          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>


        {/* Service Image */}
        <div className="w-full">

          <label className="block font-semibold text-gray-700 mb-2">
            Service Image
          </label>

          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full rounded-lg border border-gray-400
                       bg-white p-2
                       file:mr-4 file:rounded-md file:border-0
                       file:bg-gray-700 file:px-4 file:py-2
                       file:text-white
                       hover:file:bg-gray-800"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {/* Image Preview */}
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Service Preview"
                className="w-full max-w-sm h-40
                           object-contain rounded-lg
                           border border-gray-300
                           bg-gray-50"
              />
            </div>
          )}

        </div>


        {/* Price */}
        <div className="w-full">

          <label className="block font-semibold text-gray-700 mb-2">
            Price
          </label>

          <div className="relative">

            <span className="absolute left-3 top-1/2
                             -translate-y-1/2
                             text-gray-500 font-medium">
              ₹
            </span>

            <input
              type="number"
              className="w-full text-black
             border border-gray-400
             rounded-lg p-3 pl-8
             focus:outline-none
             focus:ring-2 focus:ring-blue-500
             [appearance:textfield]
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none"

              {...register("price", {
                required: "Price is required"
              })}
            />

          </div>

          {errors.price && (
            <p className="text-red-600 text-sm mt-1">
              {errors.price.message}
            </p>
          )}

        </div>


        {/* Description */}
        <div className="w-full">

          <label className="block font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            placeholder="Describe what your service includes..."
            className="w-full h-36
             text-black
             border border-gray-400
             rounded-lg p-3
             resize-none
             overflow-y-auto
             focus:outline-none
             focus:ring-2
             focus:ring-blue-500
             scrollbar-thin
             scrollbar-thumb-gray-300
             scrollbar-track-transparent"
            {...register("description", {
              required: "Description is required"
            })}
          />

          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}

        </div>


        {/* Update Button */}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className={`w-full py-3 rounded-lg
                      text-white font-semibold
                      transition-colors
                      ${
                        updateMutation.isPending
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
        >
          {updateMutation.isPending
            ? "Updating..."
            : "Update Service"}
        </button>

      </form>

    </div>
  );
}

export default EditService;