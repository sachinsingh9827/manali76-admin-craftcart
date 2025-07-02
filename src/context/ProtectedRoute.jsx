import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState("checking"); // "checking", "authorized", "unauthorized", "unauthenticated"

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token || !userData) {
      setAuthStatus("unauthenticated");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        if (userData.role === "admin") {
          setAuthStatus("authorized");
        } else {
          setAuthStatus("unauthorized"); //  not admin
        }
      } else {
        localStorage.clear();
        setAuthStatus("unauthenticated");
      }
    } catch (err) {
      localStorage.clear();
      setAuthStatus("unauthenticated");
    }
  }, [location.pathname]);

  // Loading
  if (authStatus === "checking") return <div>Checking token...</div>;

  // No token or expired
  if (authStatus === "unauthenticated") return <Navigate to="/" replace />;

  //  Has token but not admin
  if (authStatus === "unauthorized")
    return <Navigate to="/unauthorized" replace />;

  // Authorized
  return children;
};

export default ProtectedRoute;
