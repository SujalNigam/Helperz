import React, { useState } from 'react'
import useAuthStore from '../store/authStore'
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
    const token = useAuthStore((state)=>state.token);
    const savedRole = useAuthStore((state)=>state.role);
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const logoutHandler = () => {
        useAuthStore.getState().logout();
        console.log("Logout Successful");
        navigate('/login');
    }


  return (
    <nav className='
    relative flex justify-between
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
                {/* Logo Helperz */}
                <div className=' flex items-center justify-center '>
                    <NavLink className='fruktur-regular-italic font-extrabold text-xl text-amber-800' to='/'> Helperz</NavLink>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-2xl px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
        {
            token? 
            (<>
                <div className=' hidden md:flex items-center justify-center gap-4'>
                    <NavLink className='li-nav' to='/'>Home</NavLink>
                    <NavLink className='li-nav' to={`/${savedRole}/dashboard`}>Dashboard</NavLink>
                    <NavLink className='li-nav' to={`/${savedRole}/my-bookings`}>My Bookings</NavLink>
                </div>

                <div className=' hidden md:flex items-center justify-center gap-4'>   
                    <NavLink className='li-nav' to='/profile'>Profile</NavLink>
                    <button  className='li-nav' onClick={logoutHandler}>Logout</button>
                </div>

                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
                        <div className="flex flex-col gap-3 p-4">

                            <NavLink className='w-fit' to="/" onClick={() => setMenuOpen(false)}>
                                Home
                            </NavLink>

                            <NavLink className='w-fit'
                                to={`/${savedRole}/dashboard`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink className='w-fit'
                                to={`/${savedRole}/my-bookings`}
                                onClick={() => setMenuOpen(false)}
                            >
                                My Bookings
                            </NavLink>

                            <NavLink className='w-fit'
                                to="/profile"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profile
                            </NavLink>

                            <button className='self-start' onClick={()=> { setMenuOpen(false);
                            logoutHandler();}}>
                                Logout
                            </button>

                        </div>
                    </div>
                )}

            </>
            ):
            (<>

                <div className='hidden md:flex justify-center gap-4 items-center'>
                    <NavLink className='li-nav' to='/'>Home</NavLink>
                    <NavLink className='li-nav' to='/services'>Services</NavLink>
                    <NavLink className='li-nav' to='/about'>About</NavLink>
                </div>
                <div className='hidden md:flex justify-center gap-4 items-center'>
                    <NavLink className='li-nav' to='/login'>Login</NavLink>
                    <NavLink className='li-nav' to='/register'>Register</NavLink>
                </div>

                {/* ---------------------- */}

                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
                        <div className="flex flex-col gap-3 p-4">

                            <NavLink className='w-fit' to="/" onClick={() => setMenuOpen(false)}>
                                Home
                            </NavLink>

                            <NavLink className='w-fit'
                                to={`/services`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Services
                            </NavLink>

                            <NavLink className='w-fit'
                                to={`/about`}
                                onClick={() => setMenuOpen(false)}
                            >
                                About
                            </NavLink>

                            <NavLink
                                className='w-fit'
                                to='/login'
                                onClick={() => setMenuOpen(false)}>Login </NavLink>
                            <NavLink
                             className='w-fit' 
                             to='/register'
                             onClick={() => setMenuOpen(false)}>Register</NavLink>

                        </div>
                    </div>
                )}
                </>
            )
        }
            </nav>
    
  )
}

export default NavBar