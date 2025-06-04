// pages/Admin/OfferTemplates.jsx
import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AdminPageNavbar from "../../components/Navbar/AdminPageNavbar";

const OfferTemplates = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const templateId = params.id;

  const [error, setError] = useState("");

  const handleViewTemplateClick = (e) => {
    if (!templateId) {
      e.preventDefault();
      setError("Please select a template first.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-montserrat">
      <AdminPageNavbar title="Offer Templates!" />

      {/* Nav Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 border-b border-gray-300 dark:border-yellow-400 px-4 pt-4">
        {/* Template List */}
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
          Template List
        </NavLink>

        {/* Create New Template */}
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
          Add Template
        </NavLink>

        {/* View Template */}
        <NavLink
          to={templateId ? location.pathname : "/templates"}
          onClick={handleViewTemplateClick}
          className={({ isActive }) =>
            `px-4 py-2 text-sm sm:text-base rounded-md font-medium transition duration-200 ${
              isActive
                ? "bg-white text-[#004080] shadow-md border-r-4 border-[#004080] dark:border-yellow-400"
                : "bg-white dark:bg-gray-800 text-[#004080] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`
          }
        >
          View Template
        </NavLink>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 mx-4 sm:mx-6 p-2 bg-red-100 text-red-700 rounded-md max-w-md">
          {error}
        </div>
      )}

      {/* Nested Routes */}
      <div className="px-4 sm:px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default OfferTemplates;
