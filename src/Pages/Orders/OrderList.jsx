import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ReusableTable from "../../components/Reusable/ReusableTable";
import Button from "../../components/Reusable/Button";

const PAGE_SIZE = 5;
const BASE_URL = "https://craft-cart-backend.vercel.app";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}&limit=${PAGE_SIZE}`
        );

        if (response.data.success) {
          setOrders(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setOrders([]);
          setTotalPages(1);
          setError("Failed to load orders");
        }
      } catch (err) {
        setError("Failed to load orders");
        setOrders([]);
        setTotalPages(1);
        console.error(err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [page, searchTerm]);

  // Optional local filter if backend search is not enough
  const filteredOrders = orders.filter(
    (order) =>
      order.orderId?.toString().includes(searchTerm) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-sm uppercase font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center sm:text-left">
        Order List
      </h2>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to page 1 on new search
          }}
          className="p-2 sm:p-1 border rounded w-full sm:max-w-xs
            text-gray-900 dark:text-gray-100
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            placeholder-gray-500 dark:placeholder-gray-400
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
          <LoadingPage />
        </p>
      )}

      {/* No Data */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          <NoDataFound />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}

      {/* Table */}
      {!loading && !error && filteredOrders.length > 0 && (
        <ReusableTable
          columns={[
            {
              header: "SN.",
              accessor: "sn",
              render: (_, index) => index + 1 + (page - 1) * PAGE_SIZE, // Serial number with pagination offset
            },
            { header: "Order ID", accessor: "orderId" },
            { header: "Status", accessor: "status" },
            {
              header: "Total Amount",
              accessor: "totalAmount",
              render: (order) => `₹${order.totalAmount.toFixed(2)}`,
            },
            {
              header: "Actions",
              accessor: "actions",
              render: (order) => (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`admin/orders/view/${order._id}`); // Corrected path here
                  }}
                  className="text-sm px-2 py-1"
                >
                  View
                </Button>
              ),
            },
          ]}
          data={filteredOrders}
          onRowClick={(order) => navigate(`admin/orders/view/${order._id}`)} // Corrected path here
        />
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default OrderList;
