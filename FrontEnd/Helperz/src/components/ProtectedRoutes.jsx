import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore';
function ProtectedRoutes({children, allowedRole}) {
    const token = useAuthStore((state) => state.token);
    console.log(token);
    const role = useAuthStore((state) => state.role);
    console.log(role);

    if(!role || !token){
        return <Navigate to='/login' />
    }
    
    

    
        return role === allowedRole ? (
             children
        ):(
            <Navigate to='/unauthorized'/>
        )
    
    

    
 
}

export default ProtectedRoutes