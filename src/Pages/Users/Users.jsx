import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Users = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="user!" />
      <div className="flex space-x-2 border-b border-gray-300 dark:border-yellow-400  ">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-5 py-2  font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4  border-[#004080] dark:border-r-4 dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          User List
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            `px-5 py-2 font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-r-4 dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Orders
        </NavLink>
      </div>
      <Outlet /> {/* Renders nested routes */}
    </div>
  );
};

export default Users;
