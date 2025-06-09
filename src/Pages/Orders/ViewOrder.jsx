import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewOrder = () => {
  const { id } = useParams(); // order _id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await axios.get(`/api/order/${id}`); // your API to get order by id
        setOrder(res.data.order);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Order Details — #{order.orderId}
      </h2>
      <p>
        <strong>User ID:</strong> {order.userId}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Total Amount:</strong> ₹{order.totalAmount}
      </p>
      {/* Show more order details as needed */}
    </div>
  );
};

export default ViewOrder;
