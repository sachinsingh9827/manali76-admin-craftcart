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
  ];

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminPageNavbar />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
