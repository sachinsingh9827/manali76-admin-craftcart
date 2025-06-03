// components/Reusable/ProductFilter.jsx
import React from "react";

const ProductFilter = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or P.I. number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 border rounded w-full sm:max-w-xs
          text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          placeholder-gray-500 dark:placeholder-gray-400
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Sort */}
      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 border rounded
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sort by Price</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default ProductFilter;
