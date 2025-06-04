import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const ProductVideos = () => {
  const location = useLocation();
  const params = useParams();
  const productId = params.id;
  const [error, setError] = useState("");

  // Prevent "View Video" tab if no productId selected
  const handleViewVideoClick = (e) => {
    if (!productId) {
      e.preventDefault();
      setError("Please select a product first.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Common function for NavLink class styling
  const linkClass = ({ isActive }) =>
    `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
      isActive
        ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
        : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Product Videos!" />

      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        {/* Video List */}
        <NavLink to="" end className={linkClass}>
          Video List
        </NavLink>

        {/* Add New Video */}
        <NavLink to="new" className={linkClass}>
          Add New Video
        </NavLink>

        {/* View Video - requires productId */}
        <NavLink
          to={productId ? location.pathname : "/admin/videos/:id"}
          onClick={handleViewVideoClick}
          className={linkClass}
        >
          View Video
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

export default ProductVideos;
