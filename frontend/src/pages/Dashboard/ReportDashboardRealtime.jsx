"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi"; // your API client
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconDownload, IconPrinter } from "@tabler/icons-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * ReportDashboardRealtime
 *
 * - Realtime charts (polling with refetchInterval)
 * - Summary cards (top)
 * - Detailed payment table (search, date-range, status, pagination)
 * - Occupancy summary & chart
 * - Payment trend chart (paid vs pending)
 * - Tenant activity from auditLog
 * - Export to Excel / PDF and print
 */
export default function ReportDashboardRealtime() {
  // Filters & UI state
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // --- Queries: tenants and audit logs. Poll for realtime updates (15s)
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await api.get("/tenants");
      return res.data?.alltenant || [];
    },
    refetchInterval: 15000, // realtime-ish: 15s
  });

  const { data: auditLog = [], isLoading: auditLoading } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const res = await api.get("/audit");
      return res.data || [];
    },
    refetchInterval: 15000,
  });

  // --- Derived metrics
  const totalTenants = tenants.length;
  const propertyIds = tenants.map((t) => t.propertyId?._id).filter(Boolean);
  const totalProperties = new Set(propertyIds).size;

  const paidTenants = tenants.filter((t) => t.tenantsPayments === "paid");
  const pendingTenants = tenants.filter((t) => t.tenantsPayments === "pending");
  const overdueTenants = tenants.filter((t) => t.tenantsPayments === "overdue");

  const totalIncomeCollected = paidTenants.reduce(
    (s, t) => s + (Number(t.propertyId?.amount) || 0),
    0
  );
  const totalPendingAmount = pendingTenants.reduce(
    (s, t) => s + (Number(t.propertyId?.amount) || 0),
    0
  );
  const totalOverdueAmount = overdueTenants.reduce(
    (s, t) => s + (Number(t.propertyId?.amount) || 0),
    0
  );

  // Occupancy: we infer occupancy from tenants array and propertyId.units if available.
  // If you have a properties collection with units, replace this logic with a dedicated /properties call.
  const occupiedPropertyIds = new Set(tenants.map((t) => t.propertyId?._id).filter(Boolean));
  const occupied = occupiedPropertyIds.size;
  // assume each property has 1 unit if you don't have unit info — adjust if you track units
  const vacant = Math.max(0, totalProperties - occupied);
  const occupancyRate = totalProperties > 0 ? Math.round((occupied / totalProperties) * 100) : 0;
  const avgRent = totalProperties > 0 ? Math.round(totalIncomeCollected / totalProperties) : 0;

  // --- Charts data (dynamic)
  const paymentPieData = [
    { name: "Paid", value: totalIncomeCollected },
    { name: "Pending", value: totalPendingAmount },
    { name: "Overdue", value: totalOverdueAmount },
  ];
  const PIE_COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

  // Payment Trend: aggregate month-by-month from tenants' paymentDate (or createdAt)
  // We'll attempt to read t.paymentDate or t.lastPaymentDate; fallback to createdAt
  const monthFormatter = (d) => {
    const dt = new Date(d);
    if (isNaN(dt)) return null;
    return dt.toLocaleString(undefined, { month: "short", year: "numeric" });
  };

  // Build a map { "Mar 2025": { paid: X, pending: Y } }
  const trendMap = {};
  tenants.forEach((t) => {
    // prefer explicit paymentDate field; fallback to updatedAt/createdAt
    const payRaw = t.paymentDate || t.lastPaymentDate || t.updatedAt || t.createdAt;
    const month = payRaw ? monthFormatter(payRaw) : "Unknown";
    if (!month) return;
    if (!trendMap[month]) trendMap[month] = { month, paid: 0, pending: 0 };
    const amount = Number(t.propertyId?.amount) || 0;
    if (t.tenantsPayments === "paid") trendMap[month].paid += amount;
    else trendMap[month].pending += amount;
  });

  // Convert to sorted array by date (attempt parse)
  const monthlyTrend = Object.values(trendMap).sort((a, b) => {
    const pa = new Date(a.month);
    const pb = new Date(b.month);
    return pa - pb;
  });

  // --- Table: Filtering & pagination
  const filtered = tenants.filter((t) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (t.fullName || "").toLowerCase().includes(q) ||
      (t.propertyId?.title || "").toLowerCase().includes(q) ||
      (t.propertyId?.address || "").toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || t.tenantsPayments === statusFilter;

    // date range filter applied to paymentDate or createdAt or dueDate if provided
    const dateField = t.paymentDate || t.createdAt || t.updatedAt;
    let matchesDate = true;
    if (fromDate) {
      const from = new Date(fromDate);
      const d = dateField ? new Date(dateField) : null;
      if (!d || d < from) matchesDate = false;
    }
    if (toDate && matchesDate) {
      const to = new Date(toDate);
      const d = dateField ? new Date(dateField) : null;
      if (!d || d > new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1)) matchesDate = false;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered.length, totalPages]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- Export to Excel
  const exportToExcel = () => {
    const rows = tenants.map((t) => ({
      Tenant: t.fullName || "",
      Property: t.propertyId?.title || "",
      Address: t.propertyId?.address || "",
      Amount: t.propertyId?.amount || 0,
      Status: t.tenantsPayments || "",
      "Payment Date": t.paymentDate || "",
      "Due Date": t.dueDate || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `payments_export_${Date.now()}.xlsx`);
  };

  // --- Export to PDF (simple table)
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Payments Report", 14, 20);
    const rows = tenants.map((t) => [
      t.fullName || "",
      t.propertyId?.title || "",
      t.propertyId?.address || "",
      t.propertyId?.amount || 0,
      t.tenantsPayments || "",
      t.paymentDate ? new Date(t.paymentDate).toLocaleDateString() : "",
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
    ]);
    (doc).autoTable({
      head: [["Tenant", "Property", "Address", "Amount", "Status", "Payment Date", "Due Date"]],
      body: rows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
    });
    doc.save(`payments_report_${Date.now()}.pdf`);
  };

  // --- print current view
  const printReport = () => {
    window.print();
  };

  // --- small helper to format currency
  const formatCurrency = (n) => `$${Number(n || 0).toLocaleString()}`;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Real-time Reports</h1>
        <p className="text-sm text-muted-foreground">Live visualization & export of tenant payments</p>
      </div>

      {/* A. Summary overview (small cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Total Properties</CardTitle>
            <CardDescription className="text-2xl font-semibold">{totalProperties}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">Unique properties tracked</CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Total Tenants</CardTitle>
            <CardDescription className="text-2xl font-semibold">{totalTenants}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">Active tenant records</CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Income Collected</CardTitle>
            <CardDescription className="text-2xl font-semibold">{formatCurrency(totalIncomeCollected)}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">From paid tenants</CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Pending Payments</CardTitle>
            <CardDescription className="text-2xl font-semibold">{formatCurrency(totalPendingAmount)}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">{pendingTenants.length} pending</CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Overdue</CardTitle>
            <CardDescription className="text-2xl font-semibold">{formatCurrency(totalOverdueAmount)}</CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">{overdueTenants.length} overdue</CardFooter>
        </Card>
      </div>

      {/* Filters + export controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between max-w-7xl mx-auto">
        <div className="flex gap-2 items-center">
          <Input placeholder="Search tenant / property" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
            title="From"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
            title="To"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline" title="Export to Excel">
            <IconDownload className="mr-2" /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" title="Export to PDF">
            <IconDownload className="mr-2" /> PDF
          </Button>
          <Button onClick={printReport} variant="outline" title="Print">
            <IconPrinter className="mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Main content: charts + occupancy + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Payment Breakdown</CardTitle>
            <CardDescription>Real-time based on DB (auto-refreshes)</CardDescription>
          </CardHeader>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={paymentPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {paymentPieData.map((entry, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CardFooter className="flex justify-between text-sm">
            <span>Updated every 15s</span>
            <span className="text-muted-foreground">{paymentPieData.reduce((s, p) => s + p.value, 0) ? formatCurrency(paymentPieData.reduce((s, p) => s + p.value, 0)) : "—"}</span>
          </CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Property Occupancy</CardTitle>
            <CardDescription>Occupied vs Vacant</CardDescription>
          </CardHeader>
          <div className="py-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "Occupied", value: occupied },
                { name: "Vacant", value: vacant },
              ]}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  <Cell fill="#16a34a" />
                  <Cell fill="#94a3b8" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <CardFooter className="text-sm">
            <div>Occupancy: <b>{occupancyRate}%</b></div>
            <div>Avg rent per property: <b>{formatCurrency(avgRent)}</b></div>
          </CardFooter>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Payment Trend</CardTitle>
            <CardDescription>Monthly paid vs pending</CardDescription>
          </CardHeader>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="paid" name="Paid" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* B. Detailed Payment Report - Table */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Detailed Payment Report</h2>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property (title)</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">Loading...</TableCell>
                </TableRow>
              ) : paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">No records</TableCell>
                </TableRow>
              ) : (
                paged.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.fullName}</TableCell>
                    <TableCell>{t.propertyId?.title || "—"}</TableCell>
                    <TableCell>{t.propertyId?.address || "—"}</TableCell>
                    <TableCell>{formatCurrency(t.propertyId?.amount)}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${
                        t.tenantsPayments === "paid" ? "bg-green-100 text-green-800" :
                        t.tenantsPayments === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>{t.tenantsPayments}</Badge>
                    </TableCell>
                    <TableCell>{t.paymentDate ? new Date(t.paymentDate).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <div className="px-3 py-2 border rounded">{page} / {totalPages}</div>
            <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      </div>

      {/* E. Tenant Activity Report (Audit log + actions) */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><IconClock /> Tenant Activity & Audit</h2>
        <Card className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Tenant Affected</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
                ) : auditLog.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-4">No audit entries</TableCell></TableRow>
                ) : (
                  auditLog.slice(0, 20).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.user || "system"}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell>{row.tenant || "—"}</TableCell>
                      <TableCell>{row.date ? new Date(row.date).toLocaleString() : "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
