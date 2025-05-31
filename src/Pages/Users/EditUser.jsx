import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";

// Mock function to get user data
const getUserById = (id) => {
  if (id === "6832014c2b68ed7cb9a2c940") {
    return {
      name: "Sachin Singh",
      email: "sachinsingh020406@gmail.com",
      city: "Satna",
      country: "India",
      isActive: true,
      messages: [
        "Welcome to the platform!",
        "Your profile was updated.",
        "You have 3 new notifications.",
      ],
    };
  }
  return null;
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getUserById(id);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [messages] = useState(user?.messages || []);

  if (!user)
    return (
      <p className="text-gray-900 dark:text-white text-center mt-8">
        User not found
      </p>
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate API call to save user data
    console.log("Saving user data:", { id, name, email, isActive });

    // After saving, navigate back to users list
    navigate("/admin/users");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center sm:text-left">
        Edit User
      </h2>

      {/* Responsive flex container */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 max-w-5xl mx-auto">
        {/* Form Container */}
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
        </div>

        {/* Messages Container */}
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

      {/* Additional User Info */}
      <div className="max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          User Info
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          City: <span className="font-medium">{user.city}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Country: <span className="font-medium">{user.country}</span>
        </p>
      </div>
    </div>
  );
};

export default EditUser;
