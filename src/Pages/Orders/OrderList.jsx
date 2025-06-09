import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("/api/orders"); // your API endpoint for all orders
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      <ul className="list-disc pl-6">
        {orders.length === 0 && <li>No orders found.</li>}
        {orders.map((order) => (
          <li key={order._id} className="mb-2">
            <Link
              to={`/orders/view/${order._id}`}
              className="text-blue-600 hover:underline"
            >
              Order #{order.orderId} - ₹{order.totalAmount.toFixed(2)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
