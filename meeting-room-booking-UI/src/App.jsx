import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Users from "./pages/Users";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import MyBookings from "./pages/MyBookings";
import SetPassword from "./pages/SetPassword";
import BookRoom from "./pages/BookRoom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute";
import GuestRoute from "./components/GuestRoute";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestRoute>
            <Home />
          </GuestRoute>
        }
      />

      <Route
        path="/admin-login"
        element={
          <GuestRoute>
            <AdminLogin />
          </GuestRoute>
        }
      />

      <Route
        path="/employee-login"
        element={
          <GuestRoute>
            <EmployeeLogin />
          </GuestRoute>
        }
      />

      <Route
        path="/set-password"
        element={
          <GuestRoute>
            <SetPassword />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <>
              <Navbar />
              <AdminDashboard />
            </>
          </AdminRoute>
        }
      />

      <Route
        path="/employee/dashboard"
        element={
          <EmployeeRoute>
            <>
              <Navbar />
              <EmployeeDashboard />
            </>
          </EmployeeRoute>
        }
      />

      <Route
        path="/users"
        element={
          <AdminRoute>
            <>
              <Navbar />
              <Users />
            </>
          </AdminRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Rooms />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-room/:roomId"
        element={
          <EmployeeRoute>
            <>
              <Navbar />
              <BookRoom />
            </>
          </EmployeeRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <AdminRoute>
            <>
              <Navbar />
              <Bookings />
            </>
          </AdminRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <EmployeeRoute>
            <>
              <Navbar />
              <MyBookings />
            </>
          </EmployeeRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
