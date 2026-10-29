import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("reddaLoggedIn");
  const token = localStorage.getItem("reddaToken");

  if (isLoggedIn !== "true" || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;