// src/Pages/AdminDashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import AdminPageNavbar from "../components/Navbar/AdminPageNavbar";
import CommonCard from "../components/Reusable/CommonCard";
import LoadingPage from "../components/Navbar/LoadingPage";

const AdminDashboard = () => {
  const { stats, loading } = useSelector((state) => state.dashboard);

  const cards = [
    {
      id: "users",
      title: "Total Users",
      value: stats?.userCount?.toLocaleString() || "0",
      path: "/admin/users",
      description: "Manage user accounts and roles",
    },
    {
      id: "products",
      title: "Products",
      value: stats?.productCount?.toLocaleString() || "0",
      path: "/admin/products",
      description: "Manage product listings and stock",
    },
    {
      id: "contact",
      title: "Contact",
      value: stats?.contactCount?.toLocaleString() || "0",
      path: "/admin/contact",
      description: "View and manage all contact information",
    },
  ];

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminPageNavbar />
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">
            <LoadingPage />
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <CommonCard key={card.id} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
