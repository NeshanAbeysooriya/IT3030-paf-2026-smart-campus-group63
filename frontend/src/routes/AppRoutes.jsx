import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import GoogleSuccess from "../pages/GoogleSuccess";
import AdminPage from "../pages/admin";
import AboutUs from "../pages/aboutUs";
import AssetList from "../pages/AssetList";
import UserDashboard from "../pages/userDashboard";
import Overview from "../pages/userOverview";
import UserSettings from "../pages/userSetting";
import AdminDashboard from "../pages/admin/adminDashboard";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminUserManagementReport from "../pages/admin/AdminUserManagementReport";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";

// BOOKING IMPORTS
import MyBookings from "../pages/MyBookings";
import AdminBookingManagement from "../pages/admin/AdminBookingManagement";
import BookingRequest from "../pages/BookingRequest";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login-success" element={<GoogleSuccess />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/bookings" element={<BookingRequest />} />

        {/* USER DASHBOARD ROUTES (Nested) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* Automatically redirect /dashboard to /dashboard/overview */}
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          
          <Route path="overview" element={<Overview />} />
          
          
          
          {/* This matches /dashboard/bookings */}
          <Route path="mybookings" element={<MyBookings />} />
          
          <Route path="mytickets" element={<h1>Support Tickets</h1>} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* ADMIN ROUTES (Nested) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="user_management" element={<AdminUserManagement />} />
          <Route
            path="user_management/report"
            element={<AdminUserManagementReport />}
          />
          <Route path="booking" element={<AdminBookingManagement />} />
          <Route path="ticket" element={<h1>Ticket</h1>} />
          <Route path="assest" element={<h1>Assets</h1>} />
        </Route>

        {/* CATCH-ALL: Redirect any unknown URL to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
       
        

      </Routes>
    </BrowserRouter>
  );
}