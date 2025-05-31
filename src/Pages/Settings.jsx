import React, { useState, useEffect } from "react";
import AdminPageNavbar from "../components/Navbar/AdminPageNavbar";
import ConfirmationModal from "../components/Reusable/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Button from "../components/Reusable/Button";
import ThemeToggleButton from "../components/Navbar/ThemeToggle";

const menuItems = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const Settings = () => {
  const [selectedMenu, setSelectedMenu] = useState("account");
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserDetails({
      name: storedUser.username || "Alex Jackson",
      email: storedUser.email || "finalui@yandex.com",
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setModalOpen(false);
    navigate("/");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }
    alert(`Password changed successfully for ${userDetails.email}`);
    setPassword("");
    setConfirmPassword("");
    setSelectedOption(null);
  };

  const renderRightContent = () => {
    if (selectedMenu === "account") {
      if (selectedOption === "changePassword") {
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={userDetails.email}
                  readOnly
                  className="w-full px-3 py-2 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex gap-4">
                <Button type="submit">Update Password</Button>
                <Button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        );
      }

      if (selectedOption === "sendMenu") {
        return <p className="text-lg">Send Menu clicked!</p>;
      }

      return <p className="text-lg">Please select an option from the left.</p>;
    }

    if (selectedMenu === "profile") {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full text-[#004080] dark:text-yellow-400">
          <h3 className="text-xl font-semibold mb-4">Profile</h3>
          <p className="text-base mb-2">
            <strong>Name:</strong> {userDetails.name || "N/A"}
          </p>
          <p className="text-base mb-2">
            <strong>Email:</strong> {userDetails.email || "N/A"}
          </p>
          <p className="text-base mb-2">
            <strong>Mobile:</strong> {userDetails.mobile || "N/A"}
          </p>
          <p className="text-base mb-2">
            <strong>Address:</strong> {userDetails.address || "N/A"}
          </p>
          <p className="text-base mb-2">
            <strong>City:</strong> {userDetails.city || "N/A"}
          </p>
          <p className="text-base mb-2">
            <strong>Country:</strong> {userDetails.country || "N/A"}
          </p>
          {/* Add more fields similarly */}
        </div>
      );
    }

    if (selectedMenu === "settings") {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full space-y-2 text-[#004080] dark:text-yellow-400">
          <h3 className="text-xl  font-semibold mb-4">Settings</h3>

          <div className="cursor-pointer px-4 py-2 rounded text-left lg:text-left hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400 transition-colors flex justify-between items-center">
            <span>Theme:</span>
            <ThemeToggleButton />
          </div>

          <div className="cursor-pointer px-4 py-2 rounded text-left lg:text-left hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400 transition-colors flex justify-between items-center">
            <span>Language: English</span>
            {/* Right side element, e.g., a dropdown icon or button */}
            <div>▼</div>
          </div>

          <div className="cursor-pointer px-4 py-2 rounded text-left lg:text-left hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400 transition-colors">
            Integration: Google ✅
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-full">
      <AdminPageNavbar title="Settings" />

      {/* Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 w-full">
        <ul className="flex justify-center space-x-4 p-4">
          {menuItems.map(({ id, label }) => (
            <li
              key={id}
              role="tab"
              onClick={() => {
                setSelectedMenu(id);
                setSelectedOption(null);
                setError("");
              }}
              className={`cursor-pointer py-2 px-4 rounded text-[#004080] dark:text-yellow-400 transition-colors
          ${
            selectedMenu === id
              ? "bg-gray-300 dark:bg-gray-600"
              : "hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full p-2 gap-2">
        {/* Left Sidebar Options for Account */}
        {selectedMenu === "account" && (
          <div className="w-full lg:w-1/4">
            <div className="flex flex-row text-[#004080] dark:text-yellow-400 lg:flex-col gap-2 lg:gap-4 border rounded-lg p-1 bg-white dark:bg-gray-800 shadow-md">
              <div
                onClick={() => setModalOpen(true)}
                className="cursor-pointer px-4 py-2 rounded text-center lg:text-left hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400 transition-colors"
              >
                Logout
              </div>
              <div
                onClick={() => {
                  setSelectedMenu("account");
                  setSelectedOption("changePassword");
                }}
                className={`cursor-pointer px-4 py-2 rounded text-center lg:text-left transition-colors ${
                  selectedMenu === "account" &&
                  selectedOption === "changePassword"
                    ? "bg-gray-300 dark:bg-gray-600 text-[#004080] dark:text-yellow-400"
                    : "text-[#004080] dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400"
                }`}
              >
                Change Password
              </div>
              <div
                onClick={() => {
                  setSelectedMenu("account");
                  setSelectedOption("sendMenu");
                }}
                className={`cursor-pointer text-[#004080]  dark:text-yellow-400 px-4 py-2 rounded text-center lg:text-left hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-[#004080] dark:hover:text-yellow-400 transition-colors ${
                  selectedMenu === "account" &&
                  selectedOption === "changePassword"
                    ? "dark:bg-gray-600 "
                    : "bg-gray-300"
                }`}
              >
                Send Menu
              </div>
            </div>
          </div>
        )}

        {/* Right Content */}
        <div className="w-full">{renderRightContent()}</div>
      </div>

      {/* Logout Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
