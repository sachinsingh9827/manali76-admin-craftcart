// src/pages/Admin/EditOrder.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const EditOrder = () => {
  const { id } = useParams(); // order _id
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state fields
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/api/order/${id}`);
        if (res.data.success && res.data.order) {
          const ord = res.data.order;
          setOrder(ord);
          setStatus(ord.status || "");
          setPaymentMethod(ord.paymentMethod || "");
          setDeliveryAddress({
            street: ord.deliveryAddress?.street || "",
            city: ord.deliveryAddress?.city || "",
            state: ord.deliveryAddress?.state || "",
            postalCode: ord.deliveryAddress?.postalCode || "",
            country: ord.deliveryAddress?.country || "",
          });
        } else {
          setError("Order not found.");
          setOrder(null);
        }
      } catch (err) {
        setError("Failed to load order data.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedOrder = {
        status,
        paymentMethod,
        deliveryAddress,
      };

      const res = await axios.put(`${BASE_URL}/api/order/${id}`, updatedOrder);
      if (res.data.success) {
        alert("Order updated successfully!");
        navigate(`/orders/view/${id}`);
      } else {
        setError(res.data.message || "Failed to update order.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
        Loading order data...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-6 text-red-600 font-semibold">{error}</p>
    );

  if (!order)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
        Order not found.
      </p>
    );

  return (
    <div className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Edit Order #{order.orderId}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <div>
          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>
        </div>

        {/* Delivery Address */}
        <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded">
          <legend className="font-medium mb-4 text-gray-700 dark:text-gray-300">
            Delivery Address
          </legend>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              State
            </label>
            <input
              type="text"
              name="state"
              value={deliveryAddress.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={deliveryAddress.postalCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={deliveryAddress.country}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Update Order"}
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
