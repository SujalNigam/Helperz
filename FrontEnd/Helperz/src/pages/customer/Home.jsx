import React from 'react'
import Card from '../../components/Card'
import {howitworks} from '../../utils/dummyHowItWorks';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services';
import SkeletonServiceCard from '../../components/SkeletonServiceCard';
import heroImage from '../../assets/hero.png'; // adjust path
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const servicePage = 1;
  const limit = 4;
    const {data, isLoading, isError, error} = useQuery({
        queryKey:['services',servicePage],
        queryFn: () => getServices(servicePage,limit)
    })
    if(isError){
        return <p>Error: {error.message}</p>
    }
    const services = data?.services;
  return (
    <>
        <section className="bg-gradient-to-r from-blue-700 to-blue-100 text-white">
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-4 sm:gap-12">

    {/* Left */}
    <div className="flex-1">

      <p className="uppercase tracking-widest text-blue-200 font-semibold">
        Trusted Home Services
      </p>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mt-4">
        Reliable Services
        <br />
        <span className="text-amber-300">
          At Your Doorstep
        </span>
      </h1>

      <div className="flex flex-wrap gap-3 sm:gap-4 mt-8">
        <button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition">
          Explore Services
        </button>

        <button className="border-2 border-white hover:bg-white hover:text-blue-700 font-semibold px-6 py-3 rounded-lg transition">
          Become a Provider
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-5 md:gap-10 mt-10 flex-wrap">

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
    <div className=" flex-1 flex justify-center z-2 lg:z-50">
      <img
        src={heroImage}
        alt="Helperz Hero"
        className="w-full h-auto object-top max-w-xs  lg:max-w-lg drop-shadow-2xl"
      />
    </div>

  </div>
</section>

        {/* ----------------------Services showing-------------------- */}
        <div>
            <h2 className='flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 '>Popular Services</h2>
        
        { isLoading ? (<div className='flex gap-4 flex-wrap justify-center'>
                    {[1,2,3,4].map(i => <SkeletonServiceCard key={i} />)}
                    </div>):
                    data.services.length === 0 ? (<div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Services yet</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Our Providers will soon provide useful services.
                              </p>
                            </div>):
                     ( <div>
                     <div className='flex gap-4 flex-wrap justify-center'>
            {services.map((service) => <Card key={service._id} service={service}/>)
                }</div>
            <div className="flex justify-center mt-4">
                <button
                    className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => navigate("/services#services")}
                    
                >
                    View All Services →
                </button>
            </div>
            </div>)
            }
        </div>

        {/* -------------------How it works-------------------- */}
        <div className='flex text-gray-700 font-medium text-xs sm:text-base justify-center items-center gap-6 md:gap-12 mt-5 md:my-5 mx-2'>
            {howitworks.map((step)=>{
                return <span key={step.id}>{step.content}</span>
            })}
        </div>
    </>
  )
}

export default Home
