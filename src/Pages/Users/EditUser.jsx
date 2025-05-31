import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
const BASE_URL = "https://craft-cart-backend.vercel.app";
const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [messages, setMessages] = useState([]);

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
        const data = response.data.data; // Adjusted based on API structure

        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setIsActive(data.isActive ?? true);
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-700 dark:text-gray-300 mt-8">
        Loading user data...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 dark:text-red-400 mt-8">{error}</p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-gray-900 dark:text-white mt-8">
        User not found
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/users/${id}`, {
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
      await axios.put(`/api/users/${id}/status`, {
        isActive: !isActive,
      });
      setIsActive((prev) => !prev);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center sm:text-left">
        Edit User
      </h2>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 max-w-5xl mx-auto">
        {/* Form Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded shadow">
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

            <div className="flex items-center space-x-3">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="isActive"
                className="text-gray-900 dark:text-gray-200 font-medium"
              >
                Active User
              </label>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>

          <div className="mt-6">
            <Button onClick={toggleAvailability} disabled={updating}>
              {updating
                ? "Updating..."
                : isActive
                ? "Mark as Not Available"
                : "Mark as Available"}
            </Button>
          </div>
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
            <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-300">
              {messages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          User Info
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          City: <span className="font-medium">{user.city || "N/A"}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Country: <span className="font-medium">{user.country || "N/A"}</span>
        </p>
      </div>
    </div>
  );
};

export default EditUser;
