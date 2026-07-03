import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "ADMIN" ? children : <Navigate to="/employee/dashboard" replace />;
};

export default AdminRoute;
