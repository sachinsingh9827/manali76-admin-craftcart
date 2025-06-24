import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import ReusableTable from "../../components/Reusable/ReusableTable";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const ProductCard = ({ product, onDelete, type }) => (
  <div className="border rounded p-2 bg-white dark:bg-gray-700 shadow-md flex flex-col items-center space-y-2">
    <img
      src={product.images?.[0]?.url || ""}
      alt={product.name}
      className="w-20 h-20 object-cover rounded-full"
    />
    <h4 className="text-sm font-semibold text-center text-gray-900 dark:text-white">
      {product.name}
    </h4>
    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
      ₹{product.price}
    </p>
    <Button onClick={() => onDelete(product._id)} className="mt-1 text-sm">
      Remove from {type}
    </Button>
  </div>
);

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/auth/users/${id}`);
        const { user, messages, orders } = res.data.data;

        setUser(user);
        setName(user.name || "");
        setRole(user.role || "");
        setEmail(user.email || "");
        setIsActive(user.isActive ?? true);
        setMessages(messages || []);
        setOrders(orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/users/${id}`, { name, email, isActive });
      alert("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const toggleAvailability = async () => {
    setUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/user/auth/users/${id}/status`, {
        isActive: !isActive,
      });
      setIsActive((prev) => !prev);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFromWishlist = async (productId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/user/auth/wishlist/remove`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        wishlist: prev.wishlist.filter((item) => item._id !== productId),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  const handleDeleteFromCart = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}/cart/${productId}`);
      setUser((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove from cart");
    }
  };

  const messageColumns = [
    { header: "Message", accessor: "message" },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const orderColumns = [
    { header: "Order ID", accessor: "orderId" },
    {
      header: "Items",
      accessor: "items",
      render: (row) =>
        row.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
    },
    { header: "Total (₹)", accessor: "totalAmount" },
    { header: "Payment", accessor: "paymentMethod" },
    { header: "Status", accessor: "status" },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const actionData = [
    {
      id: 1,
      label: isActive ? "Deactivate User" : "Activate User",
      button: (
        <Button
          onClick={toggleAvailability}
          disabled={updating}
          className="w-full"
        >
          {updating ? "Updating..." : isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingPage />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <NoDataFound />;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          User: {user.name}
        </h2>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Role: {role}
        </span>
      </div>

      {/* User Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-900 dark:text-white mb-1">
                Name
              </label>
              <input
                className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-4">{actionData.map((a) => a.button)}</div>
            <Button type="submit" className="mt-4 w-full">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Messages */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-h-[400px] overflow-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Messages
          </h3>
          {messages.length > 0 ? (
            <ReusableTable columns={messageColumns} data={messages} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No messages</p>
          )}
        </div>
      </div>
      <div className="max-w-full mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          User Info
        </h3>

        <p className="text-gray-700 dark:text-gray-300">
          Name: <span className="font-medium">{user.name || "N/A"}</span>
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Email: <span className="font-medium">{user.email || "N/A"}</span>
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          City:{" "}
          <span className="font-medium">
            {user.addresses?.[0]?.city || "N/A"}
          </span>
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Country:{" "}
          <span className="font-medium">
            {user.addresses?.[0]?.country || "N/A"}
          </span>
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Contact:{" "}
          <span className="font-medium">
            {user.addresses?.[0]?.contact || "N/A"}
          </span>
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Role:{" "}
          <span className="font-medium capitalize">{user.role || "N/A"}</span>
        </p>
      </div>

      {/* Wishlist */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Wishlist ({user.wishlist?.length || 0})
        </h3>
        {user.wishlist?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {user.wishlist.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onDelete={handleDeleteFromWishlist}
                type="wishlist"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No items</p>
        )}
      </div>

      {/* Cart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Cart ({user.cart?.length || 0})
        </h3>
        {user.cart?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {user.cart.map((item) => (
              <ProductCard
                key={item._id}
                product={item.product}
                onDelete={handleDeleteFromCart}
                type="cart"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No items</p>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Orders ({orders.length})
        </h3>
        {orders.length > 0 ? (
          <ReusableTable columns={orderColumns} data={orders} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default EditUser;
