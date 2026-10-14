import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="route-status">Checking your session...</p>;

  if (!user)
    return <Navigate to="/login" replace state={{ from: location }}></Navigate>;

  return children;
};

export default ProtectedRoute;
