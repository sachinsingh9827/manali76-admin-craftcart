import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";

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
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
        Loading order...
      </p>
    );
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-full mx-auto p-2">
      <h2 className="text-sm uppercase font-bold mb-6 text-start text-gray-800 dark:text-white">
        Edit Order #{order.orderId}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side - Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-6 shadow rounded space-y-6"
        >
          <h3 className="text-sm uppercase  font-semibold mb-4 dark:text-white">
            Edit Order
          </h3>

          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
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
            <Button
              type="button"
              onClick={handleStatusUpdate}
              disabled={statusSaving}
            >
              {statusSaving ? "Updating Status..." : "Update Status Only"}
            </Button>
          </div>

          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          <fieldset className="border p-4 rounded">
            <legend className="font-medium dark:text-gray-200">
              Delivery Address
            </legend>
            {["street", "city", "state", "postalCode", "country"].map(
              (field) => (
                <div className="mb-3" key={field}>
                  <label className="block text-sm capitalize dark:text-gray-300">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={deliveryAddress[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              )
            )}
          </fieldset>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Order"}
          </Button>
        </form>

        {/* Right Side - Order Info */}
        <div className="bg-white dark:bg-gray-900 shadow rounded p-4 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Order Summary
            </h3>
            <p className="dark:text-gray-200">
              <strong>User ID:</strong> {order.userId}
            </p>
            <p className="dark:text-gray-200">
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p className="dark:text-gray-200">
              <strong>Status:</strong> {order.status}
            </p>
            <p className="dark:text-gray-200">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p className="dark:text-gray-200">
              <strong>Subtotal:</strong> ₹{order.subtotal}
            </p>
            <p className="dark:text-gray-200">
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>
            {order.coupon && (
              <p className="dark:text-gray-200">
                <strong>Coupon:</strong> {order.coupon.code} (
                {order.coupon.discountPercentage}%)
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Ordered Products
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border p-2 rounded shadow-sm dark:border-gray-700"
                >
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                      ₹{item.price}
                    </p>
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
