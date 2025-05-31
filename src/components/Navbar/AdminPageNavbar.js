import React from "react";
import ThemeToggleButton from "./ThemeToggle"; // adjust path if needed

const AdminPageNavbar = ({ title = "Admin" }) => {
  return (
    <nav
      className="flex justify-between items-center px-2 py-3  
      bg-[#004080] dark:bg-gray-900 
      text-white dark:text-gray-100 
      shadow-md dark:shadow-lg
      dark:border-b dark:border-yellow-400
      "
    >
      <h2 className="text-sm font-semibold uppercase m-1">{title}</h2>
      <ThemeToggleButton />
    </nav>
  );
};

export default AdminPageNavbar;
