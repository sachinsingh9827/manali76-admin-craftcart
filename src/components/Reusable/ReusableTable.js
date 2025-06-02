import React from "react";
import NoDataFound from "./NoDataFound";

const ReusableTable = ({ columns, data, onRowClick }) => {
  const hasActions = columns.some((col) => col.accessor === "actions");

  return (
    <div className="w-full">
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="border-b p-3 text-left whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className={`${
                    hasActions ? "" : "cursor-pointer"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                  onClick={() => !hasActions && onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className="border-b p-3 whitespace-nowrap"
                    >
                      {col.accessor === "actions"
                        ? col.render?.(row)
                        : col.render
                        ? col.render(row, idx)
                        : row[col.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <p className="text-center p-4 text-gray-500 dark:text-gray-400">
            No data available
          </p>
        ) : (
          data.map((row, idx) => (
            <div
              key={row._id || idx}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => !hasActions && onRowClick?.(row)}
            >
              {columns.map((col) => (
                <div
                  key={col.accessor}
                  className="flex justify-between py-1 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {col.header}:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {col.accessor === "actions"
                      ? col.render?.(row)
                      : col.render
                      ? col.render(row, idx)
                      : row[col.accessor] || "-"}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReusableTable;
