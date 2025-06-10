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
import LoadingPage from "../components/Navbar/LoadingPage";

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
        <LoadingPage />
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

  // Custom tooltip for consistent style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div
          className="rounded px-2 py-1 text-white text-xs"
          style={{ backgroundColor: "#004080" }}
        >
          <p>{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-2 font-montserrat min-h-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-2 mt-2 w-full">
        {/* Totals Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-3">
          <h3 className="text-sm uppercase font-semibold">Totals Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={totalsData}
              margin={{ top: 20, right: 30, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-90}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#004080" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Users Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-3">
          <h3 className="text-sm uppercase font-semibold ">
            New Users (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={userData}
              margin={{ top: 20, right: 30, bottom: 50 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="date"
                textAnchor="middle"
                interval={0}
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
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
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow border border-gray-200 dark:border-gray-700 md:col-span-3">
          <h3 className="text-sm uppercase font-semibold ">
            Orders (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={orderData}
              margin={{ top: 20, right: 30, bottom: 50 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="date"
                textAnchor="middle"
                interval={0}
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
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
        <h3 className="text-sm uppercase font-semibold mb-2">
          Top Selling Products
        </h3>
        {summary.topSellingProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-2">
            {summary.topSellingProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <h4 className="text-lg font-bold mb-1">{product.name}</h4>
                <p className="text-sm mb-2">Price: ₹{product.price}</p>
                <p className="text-sm text-green-600 font-semibold mt-auto">
                  Sold: {product.totalSold}
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
