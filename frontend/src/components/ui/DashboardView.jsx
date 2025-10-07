import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  IconUsers,
  IconCash,
  IconAlertTriangle,
  IconHome,
  IconTrendingUp,
  IconCircleDashed,
} from "@tabler/icons-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import api from "../../lib/api/CleintApi"

export default function DashboardOverview() {
  // 🧩 Fetch Data
  const { data: properties = [] } = useQuery({
    queryKey: ["property"],
    queryFn: async () => (await api.get("/properties")).data,
  })

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => (await api.get("/tenants")).data.alltenant,
  })

  const { data: logs = [] } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => (await api.get("/audit?limit=10")).data,
  })

  // 📊 Summary Calculations
  const totalProperties = properties.length
  const totalTenants = tenants.length

  const collectedIncome = tenants
    .filter((t) => t.propertyId?.paymentStatus === "paid")
    .reduce((sum, t) => sum + (t.propertyId?.amount || 0), 0)

  const pendingPayments = tenants
    .filter((t) => t.propertyId?.paymentStatus === "pending")
    .reduce((sum, t) => sum + (t.propertyId?.amount || 0), 0)

  // 📅 Monthly Trends
  const months = [...Array(12).keys()].map((i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    paid: 0,
    pending: 0,
  }))

  tenants.forEach((t) => {
    const createdAt = t.propertyId?.createdAt
    if (!createdAt) return
    const m = new Date(createdAt).getMonth()
    if (t.propertyId?.paymentStatus === "paid")
      months[m].paid += t.propertyId.amount || 0
    else months[m].pending += t.propertyId.amount || 0
  })

  // 🏘 Occupancy
  const occupied = properties.filter((p) => p.status === "rented").length
  const vacant = totalProperties - occupied

  const occupancyData = [
    { name: "Occupied", value: occupied },
    { name: "Vacant", value: vacant },
  ]

  const COLORS = ["#4ade80", "#f87171"]

  // 🏠 Vacancy Alerts
  const vacantList = properties.filter((p) => p.status === "available")

  return (
    <div id="dashboard-overview" className="space-y-8 px-4 lg:px-6 py-6">
      {/* 🅰️ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <Card>
          <CardHeader>
            <CardDescription>Total Properties</CardDescription>
            <CardTitle className="text-2xl">{totalProperties}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconHome />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            🏠 All properties
          </CardFooter>
        </Card>

        {/* Total Tenants */}
        <Card>
          <CardHeader>
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-2xl">{totalTenants}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconUsers />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            👥 Active tenants
          </CardFooter>
        </Card>

        {/* Collected Income */}
        <Card>
          <CardHeader>
            <CardDescription>Collected Income</CardDescription>
            <CardTitle className="text-2xl">
              {collectedIncome.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconCash />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            💰 Total paid
          </CardFooter>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <CardDescription>Pending Payments</CardDescription>
            <CardTitle className="text-2xl">
              {pendingPayments.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconAlertTriangle />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            💸 Payments awaiting completion
          </CardFooter>
        </Card>
      </div>

      {/* 📊 Charts (2-Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={months}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill="#4ade80" name="Paid" />
                <Bar dataKey="pending" fill="#f87171" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={occupancyData} dataKey="value" label>
                  {occupancyData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Recent Tenants & Activity (2-Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Name</th>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {tenants.slice(0, 5).map((t, i) => (
                  <tr key={i} className="border-t">
                    <td>{t.fullName}</td>
                    <td>{t.propertyId?.title}</td>
                    <td>{t.propertyId?.paymentStatus}</td>
                    <td>
                      {new Date(t.propertyId?.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Tenant</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-t">
                    <td>{log.tenant}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ⚠️ Vacancy Alerts */}
      <div className="space-y-3">
        {vacantList.length > 0 ? (
          <Alert variant="destructive">
            <IconAlertTriangle className="size-4" />
            <AlertTitle>Vacant Properties</AlertTitle>
            <AlertDescription>
              ⚠️ {vacantList.length} properties need tenants.  
              Some are marked as “available”.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <IconCircleDashed className="size-4" />
            <AlertTitle>All Properties Rented</AlertTitle>
            <AlertDescription>
              ✅ All properties are currently occupied.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
