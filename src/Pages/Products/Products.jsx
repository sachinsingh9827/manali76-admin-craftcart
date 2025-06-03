import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const Products = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const productId = params.id;

  const [error, setError] = useState("");
  const handleViewProductClick = (e) => {
    if (!productId) {
      e.preventDefault();
      setError("Please select a product first.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Products" />

      {/* Responsive Nav Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        {/* Product List */}
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
          Product List
        </NavLink>

        {/* Add Product */}
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
          Add Product
        </NavLink>

        {/* View Product */}
        <NavLink
          to={productId ? location.pathname : "/products"}
          onClick={handleViewProductClick}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View Product
        </NavLink>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 mx-4 sm:mx-6 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}

      {/* Nested Content */}
      <div className="px-4 sm:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Products;
