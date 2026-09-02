import React from 'react'
import {useForm} from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const {register, handleSubmit, formState : { errors } } = useForm();
    const onSubmit = async (data) => {
    try {
        const { token, user } = await loginUser(data);

        useAuthStore.getState().login(user, token);

        toast.success("Logged in successfully!");

        const from = location.state?.from;

        if (from) {
            navigate(from, { replace: true });
            return;
        }

        navigate(`/${user.role}/dashboard`, { replace: true });

    } catch (error) {
        toast.error(
            error.response?.data?.message || "Login failed"
        );
    }
};

  return (
  <div className="min-h-[70vh] flex justify-center items-center px-4">

    <form
      className="w-full max-w-md bg-white border border-gray-200
                 rounded-xl shadow-sm p-8 flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >

      {/* Heading */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Login to continue to Helperz
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300
                     rounded-lg text-black
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500"
          {...register("email", {
            required: "Email is required"
          })}
        />

        {errors.email && (
          <p className="text-red-600 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300
                     rounded-lg text-black
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500"
          {...register("password", {
            required: "Password is required"
          })}
        />

        {errors.password && (
          <p className="text-red-600 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Login button */}
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-blue-600
                   hover:bg-blue-700 text-white font-semibold
                   transition-colors"
      >
        Login
      </button>

    </form>
  </div>
);
}

export default Login