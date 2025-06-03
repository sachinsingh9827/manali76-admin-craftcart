import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Coupon = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Coupon Management" />

      {/* Responsive Tabs Container */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        {/* Coupon List tab */}
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Coupon List
        </NavLink>

        {/* Add / Update Coupon tab */}
        <NavLink
          to="edit"
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Add / Update Coupon
        </NavLink>
      </div>

      <div className="px-4 sm:px-6 py-4">
        <Outlet /> {/* Nested routes render here */}
      </div>
    </div>
  );
};

export default Coupon;
