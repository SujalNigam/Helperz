import React, { useState } from "react";
import Card from "../../components/Card";
import BookingCard from "../../components/BookingCard";
import { useNavigate } from "react-router-dom";
import { deleteService, getProviderServices } from "../../api/services";
import { getProviderBookings } from "../../api/bookings";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { updateBookingStatus } from "../../api/bookings";
import ConfirmModal from "../../components/ConfirmModal";
import toast from 'react-hot-toast';
import SkeletonServiceProviderCard from "../../components/SkeletonServiceProviderCard";
import SkeletonProviderBookingCard from "../../components/SkeletonProviderBookingCard";


function ProviderDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const [servicePage, setServicePage]= useState(1);
  const bookingPage = 1;
  const limit = 4;
  const [type, setType] = useState('upcoming');
  const navigate = useNavigate();



    const queryClient = useQueryClient();

    const mutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['providerBookings',bookingPage,type]
      });
      if(variables.status === 'accepted'){
        toast.success(`Booking ${variables.status}`);
      }
      else{
        toast(`Booking ${variables.status}`);
      }
    }
  });

    const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerServices'] });
      setShowModal(false);
      toast.success('Service deleted Successfully')
      setServiceIdToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete service");
      setShowModal(false);
    }
  });


  const handleStatusUpdate = (id, status) => {
    mutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    setServiceIdToDelete(id);
    setShowModal(true);
};

  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
    error: servicesErr,
  } = useQuery({
    queryKey: ["providerServices",servicePage],
    queryFn: () => getProviderServices(servicePage,limit),
  });

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErr,
  } = useQuery({
    queryKey: ["providerBookings",bookingPage,type],
    queryFn: ()=> getProviderBookings(bookingPage,limit,type),
  });

  if (servicesError) {
    return <p>Error: {servicesErr.message}</p>;
  }

  if (bookingsError) {
    return <p>Error: {bookingsErr.message}</p>;
  }

  

  return (
    <>
      <div>
        <h2 className="flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 ">
          My Services
        </h2>

          { servicesLoading ? (<div className='flex gap-2 md:gap-4 flex-wrap justify-center'>
                            {[1,2,3,4].map(i => <SkeletonServiceProviderCard key={i} />)}
                            </div>):
                            servicesData.services.length === 0 ? (
                              <div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Services yet</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Create your First Service.
                              </p>
                            </div>
                            ):
        (<div> 
          <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
          {servicesData.services.map((service) => {
            return <Card key={service._id} service={service} showDelete={true} onDelete={handleDelete} showEdit={true}/>;
          })}
        </div>
          <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    disabled={servicePage === 1}
                    onClick={() => setServicePage(servicePage - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <span className="text-gray-700 font-medium">
                    Page {servicePage} of {servicesData?.pagination?.totalPages || 0}
                </span>

                <button
                    disabled={!servicesData?.pagination?.hasNextPage}
                    onClick={() => setServicePage(servicePage + 1)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>)}

      <div className="flex justify-center items-center p-3">
        <button
          onClick={() => navigate("/provider/create-service")}
          className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Create Service →
        </button>
      </div>
      </div>

      {
        <div>
          <h2 className="flex justify-center items-center text-2xl p-2 mb-2 mt-2 text-gray-100 bg-blue-800 ">
            My Bookings
          </h2>

          { bookingsLoading ? (<div className='flex gap-4 flex-wrap justify-center'>
                            {[1,2,3].map(i => <SkeletonProviderBookingCard key={i} />)}
                            </div>):
                            bookingsData.bookings.length === 0 ? (<div className="flex flex-col justify-center items-center p-3">
                              <p className="text-gray-700 font-medium">No Upcoming Bookings yet</p>

                              <button
                                onClick={() => navigate("/provider/my-bookings",{
                                  state: {type: 'past'}
                                })
                                }
                                className="mt-5 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                              >
                                View Past Bookings →
                              </button>
                            </div>):
            (<div>
              <div className="flex gap-4 flex-wrap justify-center">
                {bookingsData.bookings.map((booking) => {
                  return (
                    <BookingCard
                      handleStatusUpdate={handleStatusUpdate}
                      key={booking._id}
                      booking={booking}
                      showActions={true}
                    />
                  );
                })}
            </div>
              <div className="flex justify-center mt-4">
                  <button
                      className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => navigate('/provider/my-bookings')}
                  >
                      View All Bookings →
                  </button>
              </div>
          </div>)}
        </div>
      }

      
      <ConfirmModal
    isOpen={showModal}
    title="Delete Service"
    message="This action cannot be undone."
    onCancel={() => setShowModal(false)}
    onConfirm={() => deleteMutation.mutate(serviceIdToDelete)}
    isLoading={deleteMutation.isPending}
  />

    </>
  );
}

export default ProviderDashboard;
