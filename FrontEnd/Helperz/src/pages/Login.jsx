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
    <>
    
    <div className='flex justify-center items-center m-20'>
    <form className='border-2 shadow shadow-gray-600 rounded-sm w-fit border-gray-700 flex flex-col justify-center items-center p-15 m-2 bg-amber-100'
     onSubmit={handleSubmit(onSubmit)}>
        <input className='bg-white p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' type='email' {...register("email", {required: "Email is required"})} placeholder='Enter email' />
        {errors.email && <p>{errors.email.message}</p>}
        <br></br>
        <input className='bg-white p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' type='password' {...register("password", {required: "Password is required"})} placeholder='Enter password' />
        {errors.password && <p>{errors.password.message}</p>}

        <button className='bg-gray-700 text-white p-2 m-4 rounded-md ' type='submit'>Login</button>
    </form>
    </div>
    </>
  )
}

export default Login