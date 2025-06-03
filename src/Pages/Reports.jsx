import React from "react";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../components/Navbar/AdminPageNavbar";

const Reports = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: "sales",
      title: "Sales Report",
      value: "View sales data",
      path: "/admin/reports/sales",
    },
    {
      id: "user-activity",
      title: "User Activity",
      value: "Track user actions",
      path: "/admin/reports/user-activity",
    },
    {
      id: "system-logs",
      title: "System Logs",
      value: "Review system logs",
      path: "/admin/reports/system-logs",
    },
  ];

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Cards */}
      <AdminPageNavbar title="Reports!" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded shadow p-4 hover:shadow-lg transition-shadow"
            onClick={() => navigate(card.path)}
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
