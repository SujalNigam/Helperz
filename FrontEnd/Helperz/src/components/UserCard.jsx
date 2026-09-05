import React from 'react'

function UserCard({user, onToggle}) {
  return (
    <div className={`flex border-2 flex-col w-fit px-3 py-3 ${user.isBlocked ? 'bg-gray-300 opacity-50' : 'bg-amber-200 border-amber-800'}`}>
      <p>{user.name}</p>   
      <p>{user.email}</p>   
      <p>{user.role}</p>  
      <button 
        onClick={() => onToggle(user._id)} 
        className={`mt-2 px-2 py-1 rounded text-white ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {user.isBlocked ? 'Unblock' : 'Block'}
      </button>
    </div>
  )
}

export default UserCard;