import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    return children;
  }

  return (
    <Navigate
      to={user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"}
      replace
    />
  );
};

export default GuestRoute;
