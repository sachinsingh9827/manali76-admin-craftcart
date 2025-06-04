import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboardGraph = () => {
  const { stats } = useSelector((state) => state.dashboard);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const listener = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const data = [
    { name: "Users", count: stats?.userCount || 0 },
    { name: "Products", count: stats?.productCount || 0 },
    { name: "Contacts", count: stats?.contactCount || 0 },
    { name: "Coupons", count: stats?.couponCount || 0 },
    { name: "Banners", count: stats?.bannerCount || 0 },
    { name: "Templates", count: stats?.templateCount || 0 },
  ];

  const renderTick = ({ x, y, payload }) => (
    <text
      x={x}
      y={y + 5}
      textAnchor="middle"
      fill={isDark ? "#004080" : "#f1c40f"}
      fontSize={10}
      fontWeight="bold"
    >
      {payload.value}
    </text>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full">
      <h2 className="text-start uppercase text-base sm:text-lg md:text-xl font-semibold mb-4 dark:text-white">
        Reports
      </h2>

      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 1, bottom: 20 }}
            barCategoryGap="10%"
          >
            <CartesianGrid
              strokeDasharray="2 2"
              stroke={isDark ? "#004080" : "#"}
            />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#004080" : "#004080"}
              tick={renderTick}
              axisLine={{ stroke: isDark ? "#004080" : "#004080" }}
            />
            <YAxis
              allowDecimals={false}
              stroke={isDark ? "#004080" : "#004080"}
              tick={renderTick}
              axisLine={{ stroke: isDark ? "#004080" : "#004080" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#004080" : "#",
                borderColor: "#004080",
                color: isDark ? "#004080" : "#",
                borderRadius: "8px", // Add your desired radius here
              }}
              labelStyle={{
                color: "#004080",
              }}
            />

            <Bar
              dataKey="count"
              fill={isDark ? "#" : "#004080"}
              radius={[8, 2, 0, 0]}
              barSize={40} // width of the bar in pixels, adjust as needed
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardGraph;
