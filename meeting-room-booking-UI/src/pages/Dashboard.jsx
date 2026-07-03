import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"}
      replace
    />
  );
};

export default Dashboard;
