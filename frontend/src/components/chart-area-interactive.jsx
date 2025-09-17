
import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

// ✅ Chart data
const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  // ... keep the rest of your data
];

// ✅ Main Component
export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = useState("90d");

  // ✅ Auto change range on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setTimeRange("7d");
    }
  }, []);

  // ✅ Filter data based on time range
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <h3>Total Visitors</h3>
      <p>
        {timeRange === "90d" && "Total for the last 3 months"}
        {timeRange === "30d" && "Total for the last 30 days"}
        {timeRange === "7d" && "Total for the last 7 days"}
      </p>

      {/* ✅ Time range buttons */}
      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => setTimeRange("90d")}>Last 3 months</button>
        <button onClick={() => setTimeRange("30d")}>Last 30 days</button>
        <button onClick={() => setTimeRange("7d")}>Last 7 days</button>
      </div>

      {/* ✅ Chart */}
      <AreaChart width={600} height={300} data={filteredData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <Tooltip
          formatter={(value, name) => [value, name]}
          labelFormatter={(value) => {
            return new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="#22c55e"
          fill="url(#fillMobile)"
        />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="#4f46e5"
          fill="url(#fillDesktop)"
        />
      </AreaChart>
    </div>
  );
}
