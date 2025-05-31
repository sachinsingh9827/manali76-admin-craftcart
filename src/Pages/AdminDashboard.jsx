import React from "react";
import AdminPageNavbar from "../components/Navbar/AdminPageNavbar";
import CommonCard from "../components/Reusable/CommonCard";

const AdminDashboard = () => {
  const totalUsers = 1234;

  const cards = [
    {
      id: "users",
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      path: "/admin/users",
      description: "Manage user accounts and roles",
    },
    {
      id: "settings",
      title: "Settings",
      value: "Configure system",
      path: "/admin/settings",
      description: "Update system preferences",
    },
    {
      id: "reports",
      title: "Reports",
      value: "View reports",
      path: "/admin/reports",
      description: "Generate and analyze reports",
    },
  ];

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminPageNavbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CommonCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
