import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "";

  // Get only first name (before space)
  const firstName = username.split(" ")[0];
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64
          bg-[#004080] dark:bg-gray-900
          text-white dark:text-gray-100
          shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
          dark:border-r dark:border-yellow-400
        `}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-r border-gray-700 dark:border-gray-600 dark:border-yellow-400">
          <h2 className="text-sm font-bold uppercase">
            Welcome
            {firstName && <span className=" ml-2">{firstName}</span>}
          </h2>
          {/* Close button only visible on mobile */}
          <button
            onClick={closeSidebar}
            className="md:hidden text-yellow-400 focus:outline-none"
            aria-label="Close sidebar"
          >
            {/* Close (X) icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
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

        {/* Navigation Links */}
        <nav
          className="flex flex-col mt-6 space-y-2 px-2"
          role="menu"
          aria-orientation="vertical"
        >
          {[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Products", path: "/admin/products" },
            { name: "Users", path: "/admin/users" },
            { name: "Reports", path: "/admin/reports" },
            { name: "Contact", path: "/admin/contact" },
            { name: "Settings", path: "/admin/settings" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `rounded-r-full py-2 px-4 uppercase transition-all duration-200 text-sm ${
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
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AdminSidebar;
