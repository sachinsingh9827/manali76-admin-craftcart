import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Fetch order by id
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await axios.get(`/api/order/${id}`);
        const ord = res.data.order;
        setOrder(ord);

        // Set form values
        setStatus(ord.status || "");
        setPaymentMethod(ord.paymentMethod || "");
        setDeliveryAddress({
          street: ord.deliveryAddress?.street || "",
          city: ord.deliveryAddress?.city || "",
          state: ord.deliveryAddress?.state || "",
          postalCode: ord.deliveryAddress?.postalCode || "",
          country: ord.deliveryAddress?.country || "",
        });
      } catch (err) {
        setError("Failed to load order data.");
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

      const res = await axios.put(`/api/order/${id}`, updatedOrder);
      if (res.data.success) {
        alert("Order updated successfully!");
        navigate(`/orders/view/${id}`); // Redirect to view page after update
      } else {
        setError(res.data.message || "Failed to update order.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading order data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Edit Order #{order.orderId}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
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
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>
        </div>

        {/* Delivery Address */}
        <fieldset className="border p-4 rounded">
          <legend className="font-medium mb-2">Delivery Address</legend>
          <div className="mb-2">
            <label className="block mb-1">Street</label>
            <input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">State</label>
            <input
              type="text"
              name="state"
              value={deliveryAddress.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={deliveryAddress.postalCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={deliveryAddress.country}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Order"}
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
