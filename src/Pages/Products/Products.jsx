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

      <div className="flex space-x-2 border-b border-gray-300 dark:border-yellow-400">
        {/* Link to Product List */}
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
          Product List
        </NavLink>

        {/* Link to Add Product */}
        <NavLink
          to="new"
          className={({ isActive }) =>
            `px-5 py-2 font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          Add Product
        </NavLink>

        {/* Link to View Product */}
        <NavLink
          to={productId ? location.pathname : "/products"} // fallback path if no id
          onClick={handleViewProductClick}
          className={({ isActive }) =>
            `px-5 py-2 font-medium transition-colors duration-200 relative ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View Product
        </NavLink>
      </div>
      {error && (
        <div className="m-4 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Products;
