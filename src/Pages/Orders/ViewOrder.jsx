import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

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
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/${id}`);
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
        }
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

  const handleStatusUpdate = async () => {
    setStatusSaving(true);
    setStatusError("");
    try {
      const res = await axios.patch(`${BASE_URL}/api/orders/${id}/status`, {
        status,
      });

      if (res.data.status === "success") {
        alert("Order status updated successfully!");
        setOrder((prev) => ({ ...prev, status: res.data.order.status }));
      } else {
        setStatusError(res.data.message || "Failed to update status.");
      }
    } catch (err) {
      setStatusError(err.response?.data?.message || "Status update failed.");
    } finally {
      setStatusSaving(false);
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-700">Loading order...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Order #{order.orderId}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow rounded space-y-6"
        >
          <h3 className="text-xl font-semibold mb-4">Edit Order</h3>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {statusError && <p className="text-red-600 mt-1">{statusError}</p>}
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={statusSaving}
              className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {statusSaving ? "Updating Status..." : "Update Status Only"}
            </button>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block mb-1 font-medium">Payment Method</label>
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
            <legend className="font-medium">Delivery Address</legend>
            {["street", "city", "state", "postalCode", "country"].map(
              (field) => (
                <div className="mb-3" key={field}>
                  <label className="block text-sm capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={deliveryAddress[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )
            )}
          </fieldset>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Order"}
          </button>
        </form>

        {/* Right: Order Summary & Items */}
        <div className="bg-white p-6 shadow rounded space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <p>
              <strong>User ID:</strong> {order.userId}
            </p>
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Subtotal:</strong> ₹{order.subtotal}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>
            {order.coupon && (
              <p>
                <strong>Coupon:</strong> {order.coupon.code} (
                {order.coupon.discountPercentage}%)
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Ordered Products</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border p-3 rounded shadow-sm"
                >
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="mt-1 font-semibold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
