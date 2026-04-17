import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import GoogleSuccess from "../pages/GoogleSuccess";
import AdminPage from "../pages/admin";
import AboutUs from "../pages/aboutUs";
import UserDashboard from "../pages/userDashboard";
import Overview from "../pages/userOverview";
import UserSettings from "../pages/userSetting";
import AdminDashboard from "../pages/admin/adminDashboard";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminUserManagementReport from "../pages/admin/AdminUserManagementReport";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login-success" element={<GoogleSuccess />} />
        <Route path="/about" element={<AboutUs />} />
        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* 1. THIS IS THE KEY: Redirect /dashboard to /dashboard/overview */}
          <Route
            index
            element={<Navigate to="/dashboard/overview" replace />}
          />

          {/* 2. Define the child paths */}
          <Route path="overview" element={<Overview />} />
          <Route
            path="bookings"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <h1>My Bookings</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="tickets"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <h1>Support Tickets</h1>
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="user_management" element={<AdminUserManagement />} />
          <Route
            path="user_management/report"
            element={<AdminUserManagementReport />}
          />
          <Route path="booking" element={<h1>Booking</h1>} />
          <Route path="ticket" element={<h1>Ticket</h1>} />
          <Route path="assest" element={<h1>Assets</h1>} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
