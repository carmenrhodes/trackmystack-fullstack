import { Navigate, Outlet, useLocation } from "react-router-dom";

function isLoggedIn() {
  const t = localStorage.getItem("token");
  return !!t && t !== "undefined" && t !== "null";
}

export default function ProtectedRoute() {
  const location = useLocation();

  if (!isLoggedIn()) {
    // send user to /login and remember where they were headed
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
