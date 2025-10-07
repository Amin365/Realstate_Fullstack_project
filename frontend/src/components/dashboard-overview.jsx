import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconHome } from "@tabler/icons-react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api/CleintApi";

// 🟦 Pie Chart Colors
const COLORS = ["#3b82f6", "#facc15", "#f43f5e"];

export function DashboardOverview() {
  // 🧩 Fetch tenants
   const { data: tenants = [], isLoading, isError } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await api.get("/tenants");
      return res.data.alltenant;
    },
  });

  // 🧩 Fetch payments
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await api.get("/payments")).data,
  });

  // 📊 Payment Pie Chart (real-time)
  const paidCount = payments.filter((p) => p.status === "paid").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const overdueCount = payments.filter((p) => p.status === "overdue").length;

  const pieData = [
    { name: "Paid", value: paidCount },
    { name: "Pending", value: pendingCount },
    { name: "Overdue", value: overdueCount },
  ];

  // 📈 Monthly Income Trend (simulate real-time by grouping)
  const monthlyIncome = Object.values(
    payments.reduce((acc, p) => {
      const month = new Date(p.paymentDate).toLocaleString("default", { month: "short" });
      acc[month] = acc[month] || { month, income: 0 };
      if (p.status === "paid") acc[month].income += p.amount || 0;
      return acc;
    }, {})
  );

  // 🕓 Recent Tenants (Last 2)
  const recentTenants = tenants?.slice(-2).reverse();

  return (
    <div className="space-y-6">
      {/* 🧾 Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground px-2">Loading recent tenants...</p>
        ) : recentTenants.length > 0 ? (
          recentTenants.map((tenant, index) => (
            <Card
              key={index}
              className="@container/card *:data-[slot=card]:bg-gradient-to-t from-primary/5 to-card shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tenant Name</CardTitle>
                <CardDescription className="text-lg font-medium">{tenant.fullName}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconHome className="size-4" />
                  {tenant.propertyTitle || "No property"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconClock className="size-4" />
                  {new Date(tenant.createdAt).toLocaleString()}
                </div>
                <Badge
                  className={`px-2 py-1 ${
                    tenant.status === "available"
                      ? "bg-blue-500 text-white"
                      : tenant.status === "rented"
                      ? "bg-rose-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {tenant.status || "Unknown"}
                </Badge>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground px-2">No recent tenants found.</p>
        )}
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🟦 Pie Chart - Payment Status */}
        <Card className="@container/card *:data-[slot=card]:bg-gradient-to-t from-primary/5 to-card shadow-sm">
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
            <CardDescription>Real-time summary from database</CardDescription>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 📈 Line Chart - Monthly Income */}
        <Card className="@container/card *:data-[slot=card]:bg-gradient-to-t from-primary/5 to-card shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Income Trend</CardTitle>
            <CardDescription>Paid income grouped by month</CardDescription>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
