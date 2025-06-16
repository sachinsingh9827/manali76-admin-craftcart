import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef(null);

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

  const [qrGenerated, setQrGenerated] = useState(false);

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

  const getOrderQRValue = () => {
    if (!order) return "";
    const {
      orderId,
      userId,
      items,
      subtotal,
      totalAmount,
      paymentMethod,
      status,
      deliveryAddress,
      coupon,
    } = order;

    return `Order from Craft-Cart
Order ID: ${orderId}
Customer: ${userId.name} (${userId.email})
Item: ${items[0]?.name} - ₹${items[0]?.price}
${
  coupon
    ? `Coupon: ${coupon.code} (${coupon.discountPercentage}% off, ₹${coupon.discountAmt} discount)`
    : ""
}
Subtotal: ₹${subtotal}
Total Amount: ₹${totalAmount}
Payment Method: ${
      paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"
    }
Status: ${status}
Delivery Address: ${deliveryAddress.street}, ${deliveryAddress.city}, ${
      deliveryAddress.state
    } - ${deliveryAddress.postalCode}, ${deliveryAddress.country}`;
  };

  const handleDownloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `order-${order.orderId}-qr.png`;
    link.click();
  };

  const handleDownloadInvoice = async () => {
    const element = qrRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 20;
    const width = pdf.internal.pageSize.getWidth() - margin * 2;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, width, height);
    pdf.save(`invoice-${order.orderId}.pdf`);
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
          <h3 className="text-sm uppercase font-semibold mb-4 dark:text-white">
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
              className="mt-2"
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

        {/* Right Side - Invoice + QR */}
        <div className="bg-white dark:bg-gray-900 shadow rounded p-4 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Order Summary
            </h3>
            <p className="dark:text-gray-200">
              <strong>User:</strong> {order.userId.name} ({order.userId.email})
            </p>
            <p className="dark:text-gray-200">
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p className="dark:text-gray-200">
              <strong>Status:</strong> {order.status}
            </p>
            <p className="dark:text-gray-200">
              <strong>Payment:</strong> {order.paymentMethod}
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
                {order.coupon.discountPercentage}% off - ₹
                {order.coupon.discountAmt})
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Invoice QR Code
            </h3>

            {!qrGenerated ? (
              <Button onClick={() => setQrGenerated(true)}>
                Generate Invoice
              </Button>
            ) : (
              <>
                <div
                  ref={qrRef}
                  className="space-y-3 bg-white p-4 rounded shadow dark:bg-gray-800"
                >
                  <QRCodeCanvas
                    value={getOrderQRValue()}
                    size={180}
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />

                  <div className="text-sm dark:text-white space-y-1">
                    <p>
                      <strong>Order ID:</strong> {order.orderId}
                    </p>
                    <p>
                      <strong>User:</strong> {order.userId.name} (
                      {order.userId.email})
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> ₹{order.subtotal}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </p>
                    {order.coupon && (
                      <p>
                        <strong>Coupon:</strong> {order.coupon.code} (
                        {order.coupon.discountPercentage}% off)
                      </p>
                    )}
                    <p>
                      <strong>Address:</strong> {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} -{" "}
                      {order.deliveryAddress.postalCode},{" "}
                      {order.deliveryAddress.country}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-x-2">
                  <Button onClick={handleDownloadQRCode}>
                    Download QR Code
                  </Button>
                  <Button onClick={handleDownloadInvoice}>
                    Download Invoice
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
