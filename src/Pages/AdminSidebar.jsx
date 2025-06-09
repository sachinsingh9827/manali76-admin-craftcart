import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "";
  const firstName = username.split(" ")[0];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-64
          bg-[#004080] dark:bg-gray-900
          text-white dark:text-gray-100
          shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
          dark:border-r dark:border-yellow-400
          flex flex-col
          overflow-hidden
        `}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-yellow-400">
          <h2 className="text-sm font-bold uppercase truncate max-w-[160px]">
            Welcome {firstName && <span className="ml-2">{firstName}</span>}
          </h2>
          <button
            onClick={closeSidebar}
            className="md:hidden text-yellow-400 focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[50vh] px-2 py-4 space-y-2">
          {[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Products", path: "/admin/products" },
            { name: "Users", path: "/admin/users" },
            { name: "Settings", path: "/admin/settings" },
            { name: "Templates", path: "/admin/templates" },
            { name: "Banners", path: "/admin/banners" },
            { name: "Coupons", path: "/admin/coupon" },
            { name: "Reviews", path: "/admin/reviews" },
            { name: "Videos", path: "/admin/videos" },
            { name: "Reports", path: "/admin/reports" },
            { name: "Contact", path: "/admin/contact" },
            { name: "Settings", path: "/admin/settings" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block w-full whitespace-nowrap rounded-r-full py-2 px-4 uppercase transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-gray-700 dark:bg-gray-700 text-yellow-400 font-semibold"
                    : "hover:bg-gray-700 dark:hover:bg-gray-800 text-yellow-300 hover:font-medium"
                }`
              }
              role="menuitem"
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
