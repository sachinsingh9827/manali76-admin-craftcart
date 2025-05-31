import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/admin/auth/users"); // Replace with your actual API endpoint
        setUsers(response.data); // Adjust this depending on your API response shape
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!users.length) {
    return <p>No users found.</p>;
  }

  return (
    <div className="space-y-4 p-2">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {user.name || user.username}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
          <Button
            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
            className="px-4 py-2"
          >
            Edit
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
