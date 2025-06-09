import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const ViewOrder = () => {
  const { id } = useParams(); // Order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/order/${id}`);
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        setError("Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
        Loading order...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-6 text-red-600 font-semibold">{error}</p>
    );

  if (!order)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
        No order found.
      </p>
    );

  const {
    orderId,
    status,
    paymentMethod,
    totalAmount,
    deliveryAddress,
    createdAt,
    items = [],
  } = order;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Order Details #{orderId}
      </h2>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Status:</strong> {status}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Total Amount:</strong> ₹{totalAmount}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Placed On:</strong> {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Delivery Address
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {deliveryAddress?.street}, {deliveryAddress?.city},{" "}
          {deliveryAddress?.state} - {deliveryAddress?.postalCode},{" "}
          {deliveryAddress?.country}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Items
        </h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ₹{item.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <Link
          to={`/admin/orders/edit/${id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Edit Order
        </Link>
      </div>
    </div>
  );
};

export default ViewOrder;
