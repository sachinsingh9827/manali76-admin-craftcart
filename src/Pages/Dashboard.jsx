import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/admin/auth/dashboard-summary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSummary(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-200 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6 text-center text-red-600 min-h-screen flex items-center justify-center">
        Failed to load dashboard data.
      </div>
    );
  }

  const totalsData = Object.entries(summary.totals).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: value,
  }));

  const userData = summary.dailyStats.users.length
    ? summary.dailyStats.users
    : [{ date: "No Data", count: 0 }];

  const orderData = summary.dailyStats.orders.length
    ? summary.dailyStats.orders
    : [{ date: "No Data", count: 0 }];

  return (
    <div className="mt-2 font-montserrat min-h-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-10 w-full">
        {/* Totals Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-3">
          <h3 className="text-xl font-semibold mb-4">Totals Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={totalsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Users Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-3">
          <h3 className="text-xl font-semibold mb-4">
            New Users (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3182ce"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-4">
          <h3 className="text-xl font-semibold mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#38a169"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top Selling Products */}
      <section>
        <h3 className="text-xl font-semibold mb-6">Top Selling Products</h3>
        {summary.topSellingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {summary.topSellingProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-36 object-cover rounded mb-4"
                />
                <h4 className="text-lg font-bold mb-1">{product.name}</h4>
                <p className="text-sm mb-1">ID: {product.productId}</p>
                <p className="text-sm mb-2">Price: ₹{product.price}</p>
                <p className="text-sm text-green-600 font-semibold mt-auto">
                  Sold: {product.sales}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No data available.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
