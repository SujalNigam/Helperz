import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { editProfile, getMe } from "../api/auth";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";


function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getMe,
  });

  const user = data?.user;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: editProfile,

    onSuccess: () => {
      toast.success("Profile updated successfully!");

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      setIsEditing(false);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <>Loading...</>;

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        My Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700">
            {user.name[0].toUpperCase()}
          </div>

          {isEditing ? (
            <input
              {...register("name", {
                required: "Name is required",
              })}
              className="border rounded p-2 mt-4 w-full"
            />
          ) : (
            <h2 className="text-2xl font-semibold mt-4">
              {user.name}
            </h2>
          )}

          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>
          )}

          <p className="text-gray-500">{user.role}</p>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>

            {isEditing ? (
              <>
                <input
                  {...register("phone")}
                  className="border rounded p-2 w-full"
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user.phone}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>

            <p className="font-medium capitalize">
              {user.role}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              {mutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset({
                  name: user.name,
                  phone: user.phone,
                });
                setIsEditing(false);
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
    
    </>
  );
}

export default Profile;