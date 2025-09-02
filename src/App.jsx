import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from './pages/Home';
import Register from './pages/Register';
import SearchRoutes from './pages/SearchRoutes';
import PrivateRoute from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import BookTicket from "./pages/BookTicket";
import ViewSeats from './pages/ViewSeats';

import CancelPage from './pages/CancelPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from "./pages/PaymentSuccess";


import AdminDashboard from "./pages/AdminDashboard";
import ManageBuses from "./pages/ManageBuses";
import ManageRoutes from "./pages/ManageRoutes";
import ManageUsers from "./pages/ManagaeUsers";
import ManageBookings from './pages/ManageBookings';
import ManagePayments from './pages/ManagePayments';
import ManageRefunds from './pages/ManageRefunds';
import MyBookings from './pages/MyBookings';
import MyPayment from "./pages/MyPayment";

import UserDashboard from './pages/UserDashboard';
import BusOperatorDashboard from './pages/BusOperatorDashboard';
import ViewAllBuses from "./pages/ViewAllBuses";
import ViewAllRoutes from "./pages/ViewAllRoutes"; 

import UserProfile from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import MyRefunds from "./pages/MyRefunds";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          
          <Route path="/register" element={<Register />} />

          
          <Route path="/SearchRoutes" element={<PrivateRoute><SearchRoutes /></PrivateRoute>} />
          <Route path="/book-ticket/:routeId" element={<PrivateRoute><BookTicket /></PrivateRoute>} />

          <Route path="/view-seats/:routeId" element={<PrivateRoute><ViewSeats /></PrivateRoute>} />
          
          <Route path="/cancel/:bookingId" element={<PrivateRoute><CancelPage /></PrivateRoute>} />
          <Route path="/payment/:bookingId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="//payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

          
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/buses" element={<PrivateRoute><ManageBuses /></PrivateRoute>} />
          <Route path="/manage-routes" element={<PrivateRoute><ManageRoutes /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
          <Route path="/manage-bookings" element={<PrivateRoute><ManageBookings /></PrivateRoute>} />
          <Route path="/admin/manage-payments" element={<PrivateRoute><ManagePayments /></PrivateRoute>} />
          <Route path="/admin/manage-refunds" element={<PrivateRoute><ManageRefunds /></PrivateRoute>} />

         
          <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/my-payment" element={<PrivateRoute><MyPayment /></PrivateRoute>} />
          
          <Route path="/bus-operator/dashboard" element={<PrivateRoute><BusOperatorDashboard /></PrivateRoute>} />
           <Route path="/my-refunds" element={<PrivateRoute><MyRefunds /></PrivateRoute>} />
          
          <Route path="/view-buses" element={<PrivateRoute><ViewAllBuses /></PrivateRoute>} />
          <Route path="/view-routes" element={<PrivateRoute><ViewAllRoutes /></PrivateRoute>} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/bus-operator/manage-refunds" element={<PrivateRoute><ManageRefunds /></PrivateRoute>} />
          <Route path="/bus-operator/buses" element={<PrivateRoute><ManageBuses /></PrivateRoute>} />

          

        </Routes>
         <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;