import React, { useState } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Orders = () => {
  const { id } = useParams(); // order id from URL params
  const location = useLocation();
  const [error, setError] = useState("");

  const handleViewOrderClick = (e) => {
    if (!id) {
      e.preventDefault();
      setError("Please select an order first.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Orders" />

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Order List
        </NavLink>

        <NavLink
          to={id ? location.pathname : "/orders"}
          onClick={handleViewOrderClick}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View Order
        </NavLink>

        <NavLink
          to={id ? `/orders/edit/${id}` : "/orders"}
          onClick={handleViewOrderClick}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Edit Order
        </NavLink>
      </div>

      {error && (
        <div className="mt-4 mx-4 sm:mx-6 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}

      {/* Nested routes render here */}
      <div className="px-4 sm:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Orders;
