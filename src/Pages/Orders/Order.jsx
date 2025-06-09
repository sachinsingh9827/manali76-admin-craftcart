import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Orders = () => {
  const location = useLocation();
  const isViewingOrder = location.pathname.includes("/admin/orders/view");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Orders" />

      {/* Nav Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        <NavLink
          to="/admin/orders"
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
          to={isViewingOrder ? location.pathname : "#"}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive || isViewingOrder
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white cursor-not-allowed opacity-50"
            }`
          }
          onClick={(e) => {
            if (!isViewingOrder) {
              e.preventDefault();
            }
          }}
        >
          View Order
        </NavLink>
      </div>

      {/* Render Nested Routes */}
      <div className="px-4 sm:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Orders;
