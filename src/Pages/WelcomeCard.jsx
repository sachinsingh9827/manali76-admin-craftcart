import React from "react";
import fronbannerimage from "../assets/front-banner-image.svg";

const WelcomeCard = () => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 px-6 py-8 min-h-[300px]">
      {/* Image for desktop/tablet on right */}
      <img
        src={fronbannerimage}
        alt="Decorative"
        className="hidden md:block absolute top-0 bottom-0 right-0 w-1/3 object-cover rounded-lg"
      />

      {/* Background image for mobile with overlay */}
      <div
        className="md:hidden absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: { fronbannerimage },
        }}
      ></div>

      {/* Content */}
      <div className="relative md:w-2/3">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Welcome to <span className="text-[#16a085]">Craft-Cart!</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Monitor and manage users, products, and more — all in one place.
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;
