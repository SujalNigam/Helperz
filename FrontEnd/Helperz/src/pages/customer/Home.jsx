import React from 'react'
// import { services } from '../../utils/dummyData'
import Card from '../../components/Card'
import {howitworks} from '../../utils/dummyHowItWorks';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services';
import SkeletonCard from '../../components/SkeletonCard';
import heroImage from '../../assets/hero.png'; // adjust path
// import { useNavigate } from 'react-router-dom';

function Home() {
    // const navigate = useNavigate();
    const {data, isLoading, isError, error} = useQuery({
        queryKey:['services'],
        queryFn: getServices
    })
    if(isError){
        return <p>Error: {error.message}</p>
    }
    console.log(data);
    const services = data?.services;
  return (
    // <div className="text-3xl text-blue-500">Home</div>
    <>
    {/* --------------------------------------------Hero section------------------ */}
        {/* <div className='w-full p-10 pb-5 flex flex-col gap-3 items-center justify-center bg-blue-500 '>
            <h1 className='text-gray-800 text-6xl'>Welcome to Helperz</h1>
            <p className='text-gray-300 text-3xl'>A place to Ask Help</p>
            <div className='flex gap-3 p-3 pb-0'>
                <button className='text-white  btn-home'>Find Services</button>
                <button className='text-white btn-home'>Become a provider</button>
            </div>
        </div> */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-100 text-white">
  <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

    {/* Left */}
    <div className="flex-1">

      <p className="uppercase tracking-widest text-blue-200 font-semibold">
        Trusted Home Services
      </p>

      <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-4">
        Reliable Services
        <br />
        <span className="text-amber-300">
          At Your Doorstep
        </span>
      </h1>

      <div className="flex flex-wrap gap-4 mt-8">
        <button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition">
          Explore Services
        </button>

        <button className="border-2 border-white hover:bg-white hover:text-blue-700 font-semibold px-6 py-3 rounded-lg transition">
          Become a Provider
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-10 mt-10 flex-wrap">

        <div>
          <h2 className="text-3xl font-bold">100+</h2>
          <p className="text-blue-200">Professionals</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">500+</h2>
          <p className="text-blue-200">Bookings</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">24/7</h2>
          <p className="text-blue-200">Support</p>
        </div>

      </div>

    </div>

    {/* Right */}
    <div className="max-h-[400px] flex-1 flex justify-center overflow-hidden z-50">
      <img
        src={heroImage}
        alt="Helperz Hero"
        // className="h-80 w-auto max-w-lg drop-shadow-2xl"
        className="w-full h-full object-cover object-top max-w-lg drop-shadow-2xl"
      />
    </div>

  </div>
</section>

        {/* ----------------------Services showing-------------------- */}
        <div>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>Popular Services</h2>
        
        { isLoading ? (<div className='flex gap-4 flex-wrap justify-center'>
                    {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                    </div>)
        : ( <div className='flex gap-4 flex-wrap justify-center'>
            {services.map((service) => <Card key={service._id} service={service}/>)
            }</div>)
            }
        </div>

        {/* -------------------How it works-------------------- */}
        <div className='flex justify-center items-center gap-12 my-5'>
            {howitworks.map((step)=>{
                return <span key={step.id}>{step.content}</span>
            })}
        </div>
        
    </>
  )
}

export default Home
