import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-montserrat ">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800">
        {/* Header for mobile: empty div + hamburger on right */}
        <header className="flex items-center border-b border-gray-300 dark:border-yellow-400 justify-between bg-[#004080] text-white dark:bg-gray-900 shadow px-4 h-16 md:hidden">
          <div>
            {" "}
            <h2 className=" text-2xl font-bold uppercase">Admin Panel</h2>
          </div>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Toggle sidebar"
            >
              {/* Hamburger icon */}
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </header>

        {/* Main page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
