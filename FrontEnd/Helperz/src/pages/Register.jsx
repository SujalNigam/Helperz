import React from 'react'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import toast from 'react-hot-toast';
function Register() {
    const navigate = useNavigate();

    const submitHanlder = async (data) =>{
        try{

            const {token, user} = await registerUser(data);
            console.log(user.role); // what does this print?
            useAuthStore.getState().login(user,token);
            toast.success('Registered Successfully');
    
            navigate(`/${user.role}/dashboard`);
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
            // console.log(error.message);
        }
    }

    const {register, handleSubmit, formState:{ errors } } = useForm();
  return (
    <>
    <div className='flex justify-center items-center m-20'>
        <form className='border-2 shadow shadow-gray-600 rounded-sm w-fit border-gray-700 flex flex-col justify-center items-center p-15 m-2 bg-amber-100' onSubmit={handleSubmit(submitHanlder)}>
            <input className='bg-white p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' type='text' placeholder='Enter Username: ' {...register("name", {required: 'Username is required.'})} />
            {errors.name && <p>{errors.name.message}</p>}
            <br/>
            <input className='bg-white p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' type='email' placeholder='Enter Email: ' {...register("email", {required: 'Email is required.'})} />
            {errors.email && <p>{errors.email.message}</p>}
            <br/>
            <input className='bg-white p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' type='password' placeholder='Enter Password: ' {...register("password", {required: 'Password is required.'})} />
            {errors.password && <p>{errors.password.message}</p>}
            <br/>
            <select className='bg-white text-gray-900 p-2 rounded-md border-2 border-gray-700 shadow shadow-gray-600' {...register("role", {required:'Role is required.'})} >
                <option value={''}>Select Role</option>
                <option value={'customer'}>Customer</option>
                <option value={'provider'}>Provider</option>
                <option value={'admin'}>Admin</option>
            </select>
            {errors.role && <p>{errors.role.message}</p>}
            <button className='bg-gray-700 text-white p-2 m-4 rounded-md ' type='submit'>Sign Up</button>
        </form>
        </div>
    </>
  )
}

export default Register