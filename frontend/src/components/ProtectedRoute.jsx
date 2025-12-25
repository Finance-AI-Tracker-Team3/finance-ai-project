import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If JWT exists → allow access
  if (token) {
    return children;
  }

  // Otherwise → redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
