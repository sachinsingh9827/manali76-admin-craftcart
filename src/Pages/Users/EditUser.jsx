import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import ReusableTable from "../../components/Reusable/ReusableTable";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";

const BASE_URL = "https://craft-cart-backend.vercel.app";

// Reusable product card component for wishlist and cart items
const ProductCard = ({ product, onDelete, type }) => {
  return (
    <div className="border rounded p-1 bg-white dark:bg-gray-700 shadow-md flex flex-col items-center space-y-1">
      <img
        src={product.images?.[0]?.url || ""}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-full"
      />
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center">
        {product.name}
      </h4>
      {/* <p className="text-xs text-gray-700 dark:text-gray-300 text-center line-clamp-2">
        {product.description}
      </p> */}
      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
        ₹{product.price}
      </p>
      <Button onClick={() => onDelete(product._id)} className="mt-1 text-sm">
        Remove from {type}
      </Button>
    </div>
  );
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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
        const response = await axios.get(
          `${BASE_URL}/api/admin/auth/users/${id}`
        );
        const { user, messages } = response.data.data;

        setUser(user);
        setName(user.name || "");
        setRole(user.role || "");
        setEmail(user.email || "");
        setIsActive(user.isActive ?? true);
        setMessages(messages || []);
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
      await axios.put(`${BASE_URL}/api/users/${id}`, {
        name,
        email,
        isActive,
      });
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

  const messageColumns = [
    { header: "Message", accessor: "message" },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const actionData = [
    {
      id: 2,
      label: isActive ? "Deactivate User" : "Activate User",
      button: (
        <Button
          onClick={toggleAvailability}
          disabled={updating}
          className="w-full"
        >
          {updating
            ? "Updating..."
            : isActive
            ? "Deactivate User"
            : "Activate User"}
        </Button>
      ),
    },
  ];
  const handleDeleteFromWishlist = async (productId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/user/auth/wishlist/remove`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if you're storing the token differently
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        wishlist: prevUser.wishlist.filter((item) => item._id !== productId),
      }));
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to remove item from wishlist"
      );
    }
  };

  const handleDeleteFromCart = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}/cart/${productId}`);
      setUser((prevUser) => ({
        ...prevUser,
        cart: prevUser.cart.filter((item) => item._id !== productId),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item from cart");
    }
  };

  if (loading) return <LoadingPage />;
  if (error)
    return (
      <p className="text-center text-red-600 dark:text-red-400 mt-8">{error}</p>
    );
  if (!user) return <NoDataFound />;

  return (
    <div className="min-h-auto bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
      <div className="w-full flex justify-between items-start flex-wrap gap-2 mb-4">
        <h2 className="text-sm sm:text-sm md:text-sm uppercase font-semibold text-gray-900 dark:text-white">
          User Details
        </h2>
        <h2 className="text-sm sm:text-lg md:text-sm uppercase font-semibold text-gray-900 dark:text-white">
          Role: <span className="">{user.role || "N/A"}</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 max-w-full mx-auto">
        {/* Form Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-gray-900 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-900 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="mt-4">
              {actionData.map((action) => (
                <div key={action.id} className="mb-3">
                  <label className="block mb-1 text-gray-700 dark:text-gray-300">
                    {action.label}
                  </label>
                  {action.button}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Messages Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded shadow max-h-[400px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            User Messages
          </h3>
          {messages.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No messages to show.
            </p>
          ) : (
            <ReusableTable columns={messageColumns} data={messages} />
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-full mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          User Info
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          City: <span className="font-medium">{user.city || "N/A"}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Country: <span className="font-medium">{user.country || "N/A"}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Role:{" "}
          <span className="font-medium capitalize">{user.role || "N/A"}</span>
        </p>
      </div>

      {/* Wishlist Section */}
      <div className="max-w-full mx-auto mt-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Wishlist ({user.wishlist?.length || 0})
        </h3>
        {user.wishlist && user.wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No items in wishlist.
          </p>
        )}
      </div>

      {/* Cart Section */}
      <div className="max-w-full mx-auto mt-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Cart ({user.cart?.length || 0})
        </h3>
        {user.cart && user.cart.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {user.cart.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onDelete={handleDeleteFromCart}
                type="cart"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No items in cart.
          </p>
        )}
      </div>
    </div>
  );
};

export default EditUser;
