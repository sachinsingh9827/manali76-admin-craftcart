import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";

const mockUsers = [
  {
    _id: "6832014c2b68ed7cb9a2c940",
    name: "Sachin Singh",
    email: "sachinsingh020406@gmail.com",
  },
  // Add more mock users here
];

const UserList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-2">
      {mockUsers.map((user) => (
        <div
          key={user._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {user.name}
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
