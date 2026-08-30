function SkeletonServiceCard() {
    console.log("skeletonServiceCard");
  return (
    <div className="flex justify-center items-center border-2 border-gray-200 flex-col min-w-70 bg-gray-100 px-3 py-3 animate-pulse">
      <div className="bg-gray-300 h-40 w-60 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-24 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-16 rounded"></div>
    </div>
  )
}

export default SkeletonServiceCard;