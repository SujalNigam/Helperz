function SkeletonProviderBookingCard() {
    console.log("SkeletonProviderBookingCard");
  return (
    <div className="flex max-w-md border-2 border-gray-200 flex-col min-w-70 bg-gray-100 px-3 py-3 animate-pulse">
      <div className="bg-gray-300 h-4 w-20 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-30 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-40 rounded mb-2"></div>
      <div className=" flex justify-between border-gray-200 min-w-70 bg-gray-100 px-1 py-1 animate-pulse">
         <div className=" bg-gray-300 h-4 w-10 rounded-xl"></div>
         <div className=" bg-gray-300 h-4 w-6 rounded-xl"></div>
      </div>
      <div className=" flex gap-3 border-gray-200 min-w-70 bg-gray-100 px-1 py-1 animate-pulse">
        <div className="bg-gray-300 h-10 w-40 rounded"></div>
        <div className="bg-gray-300 h-10 w-40 rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonProviderBookingCard;