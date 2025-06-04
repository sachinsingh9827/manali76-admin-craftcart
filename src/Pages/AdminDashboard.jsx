import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminPageNavbar from "../components/Navbar/AdminPageNavbar";
import CommonCard from "../components/Reusable/CommonCard";
import LoadingPage from "../components/Navbar/LoadingPage";
import AdminDashboardGraph from "./AdminDashboardGraph";

const AdminDashboard = () => {
  const { stats, loading } = useSelector((state) => state.dashboard);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

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
    {
      id: "coupon",
      title: "Coupon",
      value: stats?.couponCount?.toLocaleString() || "0",
      path: "/admin/coupon",
      description: "View and manage all coupons and discount codes",
    },
    {
      id: "Banners",
      title: "Banners",
      value: stats?.bannerCount?.toLocaleString() || "0",
      path: "/admin/banners",
      description: "Create, edit, activate or deactivate promotional banners",
    },
    {
      id: "Templates",
      title: "Templates",
      value: stats?.templateCount?.toLocaleString() || "0",
      path: "/admin/templates",
      description: "Design and manage banner layout templates",
    },
  ];

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminPageNavbar />

      {/* Hero Section */}
      <div className="px-6 py-8 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Welcome to <span className="text-[#16a085]">Craft-Cart!</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Monitor and manage users, products, and more — all in one place.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="px-2 pb-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminDashboardGraph isDark={isDark} />
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingPage />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
