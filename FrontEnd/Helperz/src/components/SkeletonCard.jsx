function SkeletonCard() {
    console.log("skeletonCard");
  return (
    <div className="flex justify-center items-center border-2 border-gray-200 flex-col min-w-30 bg-gray-100 px-3 py-3 animate-pulse">
      <div className="bg-gray-300 h-8 w-8 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-24 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 w-16 rounded"></div>
    </div>
  )
}

export default SkeletonCard;