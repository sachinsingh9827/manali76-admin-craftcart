// pages/Admin/Banner.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Banner = () => {
  const location = useLocation();
  const params = useParams();
  const bannerId = params.id;
  const [error, setError] = useState("");

  const handleViewBannerClick = (e) => {
    if (!bannerId) {
      e.preventDefault();
      setError("Please select a banner first.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Banners" />

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
          Banner List
        </NavLink>

        <NavLink
          to="new"
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Add Banner
        </NavLink>

        <NavLink
          to={bannerId ? location.pathname : "/admin/banners/:id"}
          onClick={handleViewBannerClick}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View Banner
        </NavLink>
      </div>

      {error && (
        <div className="mt-4 mx-4 sm:mx-6 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}

      <div className="px-4 sm:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Banner;
