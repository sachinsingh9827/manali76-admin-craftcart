// src/pages/Admin/ViewOrder.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const ViewOrder = () => {
  const { id } = useParams(); // order _id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/order/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError("Order not found.");
          setOrder(null);
        }
      } catch (err) {
        setError("Failed to load order details.");
        setOrder(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <LoadingPage />;

  if (error)
    return (
      <p className="text-red-600 text-center mt-6 font-semibold">{error}</p>
    );

  if (!order)
    return (
      <p className="text-center mt-6 font-semibold text-gray-700 dark:text-gray-300">
        Order not found.
      </p>
    );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Order Details — #{order.orderId}
      </h2>

      <div className="space-y-2 text-gray-800 dark:text-gray-200">
        <p>
          <strong>User ID:</strong> {order.userId}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              order.status === "Delivered"
                ? "text-green-600"
                : order.status === "Cancelled"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {order.status}
          </span>
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>

        {/* Example: List order items */}
        {order.items && order.items.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold text-lg">Items:</h3>
            <ul className="list-disc pl-6">
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.productName} — Qty: {item.quantity} — Price: ₹
                  {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Add more info like shipping address, payment details, etc, if available */}
      </div>
    </div>
  );
};

export default ViewOrder;
