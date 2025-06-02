import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import ReusableTable from "../../components/Reusable/ReusableTable"; // Adjust import path
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";

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
        const { user, messages } = response.data.data;

        setUser(user);
        setName(user.name || "");
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

  if (loading) {
    return (
      <p className="text-center text-gray-700 dark:text-gray-300 mt-8">
        <LoadingPage />
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
        <NoDataFound />
      </p>
    );
  }

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
      await axios.put(`${BASE_URL}/api/users/${id}/status`, {
        isActive: !isActive,
      });
      setIsActive((prev) => !prev);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  // Columns for messages table
  const messageColumns = [
    { header: "Message", accessor: "message" },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  // Columns for the action buttons table
  const actionColumns = [
    { header: "Action", accessor: "label" },
    {
      header: "Button",
      accessor: "button",
      render: (row) => row.button,
    },
  ];

  // Data for the action buttons table
  const actionData = [
    {
      id: 1,
      label: "Save Changes",
      button: (
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      ),
    },
    {
      id: 2,
      label: isActive ? "Mark as Not Available" : "Mark as Available",
      button: (
        <Button
          onClick={toggleAvailability}
          disabled={updating}
          className="w-full"
        >
          {updating
            ? "Updating..."
            : isActive
            ? "Mark as Not Available"
            : "Mark as Available"}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-2 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-start sm:text-left">
        All User details
      </h2>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 max-w-full mx-auto">
        {/* Form Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded shadow max-w-full">
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

            {/* Action Buttons inside reusable table */}
            <div className="overflow-x-auto">
              <ReusableTable columns={actionColumns} data={actionData} />
            </div>
          </form>
        </div>

        {/* Messages Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded shadow max-h-[400px] overflow-y-auto max-w-full">
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
      </div>
    </div>
  );
};

export default EditUser;
