import React from 'react';
import { formatDate } from '../utils/formatDate';

function BookingCard({
  booking,
  handleStatusUpdate,
  showActions,
  showCancel,
  onCancel
}) {
  const customerName = booking.contactName || booking.customerId?.contactName;
  const appointmentPassed = new Date(booking.appointmentDateTime) < new Date();
  // console.log(booking);
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-200 text-gray-700"
  };
  const isExpired =
    booking.status === "pending" && appointmentPassed;

  return (
    <div className=" min-w-sm max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">

      {/* Service */}
      <h2 className="text-xl line-clamp-1 wrap-anywhere  font-semibold text-gray-800">
        {booking.serviceName}
      </h2>

      <p className="text-gray-500 wrap-anywhere line-clamp-1 mt-1">
        Customer: <span className="font-medium">{customerName}</span>
      </p>

      <p className="text-gray-500">
    {booking.slot &&
        `${new Date(booking.slot.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        })} at ${booking.slot.time}`
    }
</p>

      <div className="mt-4 flex items-center justify-between">

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isExpired
              ? "bg-gray-200 text-gray-700"
              : statusColors[booking.status]
          }`}
        >
          {isExpired ? "Expired" : booking.status}
        </span>

        <span className="font-bold text-green-600">
          ₹{booking.price}
        </span>

      </div>

    {booking.status === "pending" &&
      showActions &&
      !appointmentPassed && (
        <div className="flex gap-3 mt-5">
          <button
            onClick={() =>
              handleStatusUpdate(booking._id, "accepted")
            }
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() =>
              handleStatusUpdate(booking._id, "rejected")
            }
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
    )}

      {booking.status === "pending" &&!appointmentPassed && showCancel && (
        <button
          onClick={() => onCancel(booking._id)}
          className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
}

export default BookingCard;