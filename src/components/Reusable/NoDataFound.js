import React from "react";
import { FiInbox } from "react-icons/fi";
import Nodata from "../../assets/no-data-concept-illustration_634196-28495.avif";
const NoDataFound = ({
  message = "No data found",
  className = "",
  image = Nodata, // Default image path (light mode)
  darkImage = "", // Optional dark mode image path
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 text-gray-600 dark:text-gray-300 animate-fade-in ${className}`}
    >
      {image && (
        <>
          {/* Light mode image */}
          <img
            src={image}
            alt="No data"
            className={`w-32 h-32 mb-4 object-contain block dark:hidden`}
          />
          {/* Dark mode image (optional) */}
          {darkImage && (
            <img
              src={darkImage}
              alt="No data dark"
              className="w-32 h-32 mb-4 object-contain hidden dark:block"
            />
          )}
        </>
      )}

      <FiInbox
        size={48}
        className="mb-2 animate-bounce text-gray-400 dark:text-gray-500"
      />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default NoDataFound;
