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
import AdminTickets from "../pages/admin/AdminTickets";
import AdminAssets from "../pages/admin/AdminAssets";
import AdminAssetManagementReport from "../pages/admin/AdminAssetManagementReport";
import AssetDetail from "../pages/AssetDetail";
import AssetsPage from "../pages/AssetsPage";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminUserManagementReport from "../pages/admin/AdminUserManagementReport";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";

// BOOKING IMPORTS
import MyBookings from "../pages/MyBookings";
import AdminBookingManagement from "../pages/admin/AdminBookingManagement";
import BookingRequest from "../pages/BookingRequest";
import TechnicianPage from "../pages/TechnicianPage";
import TechnicianJobs from "../pages/TechnicianJobs";
import UserTickets from "../pages/UserTickets";

// CONTACT US IMPORT
import ContactUs from "../pages/ContactUs";

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
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/bookings" element={<BookingRequest />} />

        {/* USER DASHBOARD ROUTES (Nested) */}
        <Route path="/dashboard" element={<UserDashboard />}>
          {/* Automatically redirect /dashboard to /dashboard/overview */}
          <Route
            index
            element={<Navigate to="/dashboard/overview" replace />}
          />

          <Route path="overview" element={<Overview />} />

          {/* This matches /dashboard/bookings */}
          <Route path="mybookings" element={<MyBookings />} />

          <Route path="tickets" element={<UserTickets />} />
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
          <Route path="ticket" element={<AdminTickets />} />
          <Route path="assets" element={<AdminAssets />} />
          <Route path="assets/report" element={<AdminAssetManagementReport />} />
        </Route>

        <Route path="/technician" element={<TechnicianPage />}>
          <Route path="dashboard" element={<Navigate to="/technician/jobs" replace />} />
          <Route path="jobs" element={<TechnicianJobs />} />
          <Route path="assigned" element={<h1>Task</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
        </Route>

        {/* CATCH-ALL: Redirect any unknown URL to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
