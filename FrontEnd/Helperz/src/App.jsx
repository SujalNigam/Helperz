import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import NavBar from './components/NavBar';
import { getMe } from './api/auth';
import useAuthStore from './store/authStore';

// import CreateService from './pages/provider/CreateService';
// import ServiceDetail from './pages/ServiceDetail';
import {BarLoader} from 'react-spinners';
const Home = lazy(() => import('./pages/customer/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
// import CustomerDashboard from './pages/customer/CustomerDashboard';
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UnAuthorized = lazy(()=> import('./pages/UnAuthorized'));
const ServiceDetail = lazy(()=>import('./pages/ServiceDetail'));
const Booking = lazy(() => import('./pages/customer/Booking'));
const CreateService = lazy(()=>import('./pages/provider/CreateService'));
const NotFound = lazy(()=>import('./pages/NotFound'));
// import EditService from './pages/provider/EditService';
const EditService = lazy(()=>import('./pages/provider/EditService'));
const Profile = lazy(()=>import('./pages/Profile'));
const GenerateSlots = lazy(()=>import('./pages/provider/GenerateSlots'));
const ManageSlots = lazy(()=>import('./pages/provider/ManageSlots'));
const MyBookings = lazy(()=> import('./pages/customer/MyBookings'));



function App() {
 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    getMe().then((data) => {
      useAuthStore.getState().setUser(data.user);
    });
  }
}, []);
  return (
    <Suspense fallback={<div><BarLoader/></div>}>
    <NavBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element  = {<Profile/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        <Route path='/customer/dashboard' element={
          <ProtectedRoutes allowedRole={'customer'}>
              <CustomerDashboard />
          </ProtectedRoutes>
          } />
        <Route path='/customer/my-bookings' element={
          <ProtectedRoutes allowedRole={'customer'}>
              <MyBookings />
          </ProtectedRoutes>
          } />
        <Route path='/provider/dashboard' element={<ProtectedRoutes allowedRole={'provider'}>
              <ProviderDashboard />
          </ProtectedRoutes>} />
        <Route path='/admin/dashboard' element={<ProtectedRoutes allowedRole={'admin'}>
              <AdminDashboard />
          </ProtectedRoutes>} />
        <Route path='/unauthorized' element={
              <UnAuthorized />
          } />
        <Route path='/services/editService/:id' element={
          <ProtectedRoutes allowedRole={'provider'}>
             <EditService />
          </ProtectedRoutes>
             
          } />
        <Route path='/services/:id' element={
              <ServiceDetail />
          } />

          {/* / in Routes: */}
        <Route path='/booking/:id' element={ <ProtectedRoutes allowedRole={'customer'}>
          <Booking />
        </ProtectedRoutes>} />
        
            <Route path='/provider/create-service' element={<ProtectedRoutes allowedRole={'provider'}>
                  <CreateService /> 
            </ProtectedRoutes>} />

            <Route path='/provider/services/:id/generate-slots' element={<ProtectedRoutes allowedRole={'provider'}>
                  <GenerateSlots /> 
            </ProtectedRoutes>} />

            <Route path='/provider/services/:id/manage-slots' element={<ProtectedRoutes allowedRole={'provider'}>
                  <ManageSlots /> 
            </ProtectedRoutes>} />

            <Route path='*' element={<NotFound />} />


            
       
      </Routes>
    </Suspense>
  );
}

export default App;