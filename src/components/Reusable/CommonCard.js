// components/Cards/CommonCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CommonCard = ({ title, value, description, path }) => {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => navigate(path)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(path);
      }}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 border-l-4 border-[#004080] dark:border-yellow-400"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl mt-3 font-bold">{value}</p>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default CommonCard;
