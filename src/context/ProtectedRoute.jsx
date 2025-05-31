// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authorized, setAuthorized] = useState(null); // null = checking

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        setAuthorized(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthorized(false);
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthorized(false);
    }
  }, [location.pathname]); // re-run on every page change

  if (authorized === null) {
    return <div>Checking token...</div>;
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
