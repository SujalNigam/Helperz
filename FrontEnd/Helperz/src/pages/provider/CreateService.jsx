import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createService } from '../../api/services';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';

function CreateService() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { price: 100 }
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

  const submitHandler = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    mutation.mutate(formData);
  };

  return (
    <div className="flex justify-center items-center p-4 md:p-8">

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-xl bg-white border border-gray-200
                   rounded-xl shadow-md p-6 md:p-8
                   flex flex-col gap-5"
      >

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Service
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Add the details of the service you want to provide
          </p>
        </div>

        {/* Service Title */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Service Title
          </label>

          <input
            type="text"
            placeholder="e.g. Home Cleaning"
            className="w-full text-black border border-gray-300
                       rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Service Image
          </label>

          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Image is required"
            })}
            className="w-full rounded-lg border border-gray-300
                       bg-white p-2
                       file:mr-4 file:rounded-md file:border-0
                       file:bg-blue-600 file:px-4 file:py-2
                       file:text-white
                       hover:file:bg-blue-700"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {errors.image && (
            <p className="text-red-600 text-sm mt-1">
              {errors.image.message}
            </p>
          )}

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Service Preview"
                className="w-full max-w-sm h-40 object-contain
                           rounded-lg border border-gray-200 bg-gray-50"
              />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price
          </label>

          <div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
    ₹
  </span>

  <input
    type="number"
    min="1"
    placeholder="Enter price"
    className="w-full text-black border border-gray-300 rounded-lg p-3 pl-10
               focus:outline-none focus:ring-2 focus:ring-blue-500
               appearance-textfield
               [&::-webkit-inner-spin-button]:appearance-none
               [&::-webkit-outer-spin-button]:appearance-none
              "
    {...register("price", {
      required: "Price is required",
      min: {
        value: 1,
        message: "Price must be greater than 0"
      }
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            placeholder="Describe what your service includes..."
            className="w-full text-black border border-gray-300
                       rounded-lg p-3 min-h-32 resize-y
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`w-full py-3 rounded-lg text-white font-semibold
                      transition-colors
            ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {mutation.isPending ? "Creating..." : "Create Service"}
        </button>

        {/* Error */}
        {mutation.isError && (
          <p className="text-red-600 text-sm text-center">
            {mutation.error.response?.data?.message ||
              "Failed to create service"}
          </p>
        )}

      </form>
    </div>
  );
}

export default CreateService;
