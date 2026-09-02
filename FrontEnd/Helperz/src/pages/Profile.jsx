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
  <div className="min-h-screen bg-gray-50 px-4 py-10">

    {/* Page Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        My Profile
      </h1>

      <p className="text-gray-500 mt-2">
        Manage your personal information
      </p>
    </div>

    {/* Profile Card */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
    >

      {/* Simple Profile Header */}
      <div className="flex items-center gap-4 mb-6">

        <div className="w-20 h-20 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
          {user.name?.[0]?.toUpperCase()}
        </div>

        <div className="min-w-0">

          {isEditing ? (
            <div>
              <input
                {...register("name", {
                  required: "Name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800 wrap-anywhere">
              {user.name}
            </h2>
          )}

          <p className="text-sm text-gray-500 capitalize mt-1">
            {user.role}
          </p>

        </div>

      </div>

      <div className="border-t border-gray-200 my-6" />

      {/* Information */}
      <div className="space-y-5">

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Email Address
          </p>

          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-800 break-all">
              {user.email}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Phone Number
          </p>

          {isEditing ? (
            <>
              <input
                {...register("phone")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </>
          ) : (
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-800">
                {user.phone || "Not provided"}
              </p>
            </div>
          )}
        </div>

        {/* Role */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Account Type
          </p>

          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-800 capitalize">
              {user.role}
            </p>
          </div>
        </div>

      </div>

      {/* Actions */}
      {isEditing ? (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
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
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>

        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Edit Profile
        </button>
      )}

    </form>
  </div>
);
}

export default Profile;