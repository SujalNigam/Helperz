import React from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();

    const submitHandler = async (data) => {
        try {
            const { token, user } = await registerUser(data);

            useAuthStore.getState().login(user, token);

            toast.success('Registered Successfully');

            navigate(`/${user.role}/dashboard`);
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    return (
        <div className="flex justify-center items-center px-4 pt-12 pb-10">

            <form
                className="w-full max-w-md bg-white border border-gray-200
                           rounded-xl shadow-sm p-8 flex flex-col gap-5"
                onSubmit={handleSubmit(submitHandler)}
            >

                {/* Heading */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Account
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Join Helperz and get started
                    </p>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300
                                   rounded-lg text-black
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500"
                        {...register("name", {
                            required: "Username is required."
                        })}
                    />

                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
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
                            required: "Email is required."
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
                            required: "Password is required."
                        })}
                    />

                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Register as
                    </label>

                    <select
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300
                                   rounded-lg text-gray-900
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500"
                        {...register("role", {
                            required: "Role is required."
                        })}
                    >
                        <option value="">Select role</option>
                        <option value="customer">Customer</option>
                        <option value="provider">Provider</option>
                    </select>

                    {errors.role && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.role.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 rounded-lg text-white font-semibold
                               transition-colors ${
                        isSubmitting
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </button>

            </form>
        </div>
    );
}

export default Register;

