import { Navigate } from "react-router-dom";

const EmployeeRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "EMPLOYEE" ? (
    children
  ) : (
    <Navigate to="/admin/dashboard" replace />
  );
};

export default EmployeeRoute;
