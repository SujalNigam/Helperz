import React from 'react'
import useAuthStore from '../store/authStore'
import { NavLink, useNavigate } from 'react-router-dom';
function NavBar() {
    const token = useAuthStore((state)=>state.token);
    const savedRole = useAuthStore((state)=>state.role);
    const navigate = useNavigate();

    const logoutHandler = () => {
        useAuthStore.getState().logout();
        console.log("Logout Successful");
        navigate('/login');
    }
  return (
    <nav className='
    flex justify-between
    items-center 
    p-3
   bg-white/20
    backdrop-blur-xl
    border-b border-white/20
    shadow-lg
  supports-backdrop-filter:bg-white/10
    sticky top-0
    z-50
    
    '>
        {
            token? 
            (<>
                <ul className=' flex items-center justify-center '>
                    <li className='fruktur-regular-italic font-extrabold text-xl text-amber-800'> <NavLink to='/'>Helperz</NavLink></li>
                </ul>

                <ul className=' flex items-center justify-center gap-4'>
                    <li className='li-nav'> <NavLink to='/'>Home</NavLink></li>
                    <li className='li-nav'> <NavLink to={`/${savedRole}/dashboard`}>Dashboard</NavLink></li>
                    <li className='li-nav'> <NavLink to={`/${savedRole}/my-bookings`}>My Bookings</NavLink></li>
                </ul>

                <ul className=' flex items-center justify-center gap-4'>   
                    <li className='li-nav'> <NavLink to='/profile'>Profile</NavLink></li>
                    <li className='li-nav'> <button onClick={logoutHandler}>Logout</button></li>
                </ul>

            </>
            ):
            (<>
                <ul className='flex justify-center items-center'>
                   <li className='li-nav'> <NavLink to='/'>Logo</NavLink></li>
                </ul>

                <ul className='flex justify-center gap-4 items-center'>
                    <li className='li-nav'> <NavLink to='/'>Home</NavLink></li>
                    <li className='li-nav'> <NavLink to='/'>Services</NavLink></li>
                    <li className='li-nav'> <NavLink to='/about'>About</NavLink></li>
                </ul>
                <ul className='flex justify-center gap-4 items-center'>
                    <li className='li-nav'> <NavLink to='/login'>Login</NavLink></li>
                    <li className='li-nav'> <NavLink to='/register'>Register</NavLink></li>
                </ul>
                </>
            )
        }
            </nav>
    
  )
}

export default NavBar