import React from "react";

const Orders = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Orders
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This is the Orders page. You can list all orders here.
        </p>
        {/* Add your table or order list component here */}
      </div>
    </div>
  );
};

export default Orders;
