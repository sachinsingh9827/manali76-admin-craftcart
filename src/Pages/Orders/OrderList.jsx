import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("/api/order/all"); // your API endpoint
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border p-3 rounded hover:bg-gray-100"
            >
              <Link to={`/orders/${order._id}`}>
                <strong>Order #{order.orderId}</strong> — Total: ₹
                {order.totalAmount}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
