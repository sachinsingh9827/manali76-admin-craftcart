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

      // ✅ Check expiration and role
      if (decoded.exp > now && decoded.role === "admin") {
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
  }, [location.pathname]);

  if (authorized === null) {
    return <div>Checking token...</div>;
  }

  if (!authorized) {
    return <Navigate to="/unauthorized" replace />; // 👈 Redirect to unauthorized page
  }

  return children;
};

export default ProtectedRoute;
