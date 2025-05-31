import React from "react";
import LoadingPage from "../Navbar/LoadingPage";

const Pagination = ({ page, totalPages, onPageChange, loading }) => {
  return (
    <nav
      aria-label="Pagination Navigation"
      className="mt-6 flex flex-row justify-center items-center space-x-3 px-2 sm:px-0"
    >
      <button
        aria-label="Previous page"
        disabled={page === 1 || loading}
        onClick={() => onPageChange(page - 1)}
        className={`px-3 py-1.5 rounded transition-colors duration-200
      ${
        page === 1 || loading
          ? "bg-gray-400 cursor-not-allowed text-gray-700"
          : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      }
      sm:px-4 sm:py-2 sm:w-auto w-24
    `}
      >
        {loading && page !== 1 ? (
          <span className="flex items-center justify-center text-sm sm:text-base">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Prev"
        )}
      </button>

      <span
        className="px-2 py-1 text-gray-900 dark:text-gray-100 whitespace-nowrap text-center text-sm sm:text-base"
        aria-live="polite"
      >
        Page {page} of {totalPages}
      </span>

      <button
        aria-label="Next page"
        disabled={page === totalPages || totalPages === 0 || loading}
        onClick={() => onPageChange(page + 1)}
        className={`px-3 py-1.5 rounded transition-colors duration-200
      ${
        page === totalPages || totalPages === 0 || loading
          ? "bg-gray-400 cursor-not-allowed text-gray-700"
          : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      }
      sm:px-4 sm:py-2 sm:w-auto w-24
    `}
      >
        {loading && page !== totalPages ? <LoadingPage /> : "Next"}
      </button>
    </nav>
  );
};

export default Pagination;
