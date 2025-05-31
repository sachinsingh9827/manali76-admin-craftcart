import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";
import LoadingPage from "../../components/Navbar/LoadingPage";
const PAGE_SIZE = 5;
const BASE_URL = "https://craft-cart-backend.vercel.app";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/admin/auth/users?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}&limit=${PAGE_SIZE}`
        );

        if (response.data.success) {
          setUsers(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(1);
          setError("Failed to load users");
        }
      } catch (err) {
        setError("Failed to load users");
        setUsers([]);
        setTotalPages(1);
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [page, searchTerm]);

  // Optional: client-side filtering if API search isn't perfect
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 text-center sm:text-left">
        User List
      </h2>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to page 1 on new search
          }}
          className="p-2 sm:p-3 border rounded w-full sm:max-w-xs
            text-gray-900 dark:text-gray-100
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            placeholder-gray-500 dark:placeholder-gray-400
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
          <LoadingPage />
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 dark:text-red-400 mb-4">
          {error}
        </p>
      )}

      {/* No Data */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          <NoDataFound />
        </div>
      )}

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {user.name || user.username}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <Button
              className="px-4 py-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/users/edit/${user._id}`);
              }}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;
