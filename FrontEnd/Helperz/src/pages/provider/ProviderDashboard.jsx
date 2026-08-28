import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
// import { services } from '../../utils/dummyData';
import Card from "../../components/Card";
import BookingCard from "../../components/BookingCard";
// import { bookings } from '../../utils/dummyBookings';
import { useNavigate } from "react-router-dom";
import { deleteService, getProviderServices } from "../../api/services";
import { getProviderBookings } from "../../api/bookings";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { updateBookingStatus } from "../../api/bookings";
import ConfirmModal from "../../components/ConfirmModal";
import toast from 'react-hot-toast';


function ProviderDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const user = useAuthStore((state) => state.user);
  const [servicePage, setServicePage]= useState(1);
  const bookingPage = 1;
  const limit = 4;
  const [type, setType] = useState('upcoming');
  const navigate = useNavigate();



    const queryClient = useQueryClient();

    const mutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),

    onSuccess: (data, variables) => {
      console.log(variables.status);
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

  // const updateBookingStatus = (id, status)=>{
  //     setBookingList(bookingList.map((b)=>{return b.id==id?{...b, status:status}:b}));
  // }

  const handleStatusUpdate = (id, status) => {
    mutation.mutate({ id, status });
  };

  // const handleDelete = (id) => {
  //   deleteMutation.mutate({id});
  // }
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

  if (servicesLoading) {
    return <p>Loading...</p>;
  }
  if (servicesError) {
    return <p>Error: {servicesErr.message}</p>;
  }


  if (bookingsLoading) {
    return <p>Loading...</p>;
  }
  if (bookingsError) {
    return <p>Error: {bookingsErr.message}</p>;
  }

  

  return (
    <>
      <h1>Hi {user.name}! Welcome to ProviderDashboard</h1>
      {/* =------------------- */}
      <div>
        <h2 className="flex justify-center items-center text-2xl p-2 mb-2 text-gray-100 bg-blue-800 ">
          My Services
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {servicesData.services.map((service) => {
            return <Card key={service._id} service={service} showDelete={true} onDelete={handleDelete} showEdit={true}/>;
          })}
        </div>
        {/* ==================== */}
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
        {/* ---------------------- */}
      <div className="flex justify-center items-center p-3">
        <button
          onClick={() => navigate("/provider/create-service")}
          className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Create Service →
        </button>
      </div>
      </div>

      {/* ------------ */}
      {
        <div>
          <h2 className="flex justify-center items-center text-2xl p-2 mb-2 mt-2 text-gray-100 bg-blue-800 ">
            My Bookings
          </h2>
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
