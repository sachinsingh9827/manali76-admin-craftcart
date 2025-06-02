import React, { useState } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Users = () => {
  const { id } = useParams(); // Get :id from the route if present
  const location = useLocation();

  const [error, setError] = useState("");

  const handleOrdersClick = (e) => {
    if (!id) {
      e.preventDefault(); // Stop navigation
      setError("Please select a user first.");
      setTimeout(() => setError(""), 3000); // Clear after 3s
    }
  };

  return (
    <div className="min-h-screen  bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="user!" />
      <div className="flex space-x-2 border-b border-gray-300 dark:border-yellow-400">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-5 py-2 font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          User List
        </NavLink>

        <NavLink
          to={id ? location.pathname : "/users"} // stay in place if no id
          onClick={handleOrdersClick}
          className={({ isActive }) =>
            `px-5 py-2 font-medium transition-colors duration-200 relative  ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View user
        </NavLink>
      </div>
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}
      <Outlet /> {/* Renders nested routes */}
    </div>
  );
};

export default Users;
