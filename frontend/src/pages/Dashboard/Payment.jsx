import * as React from "react";
import {
  IconCreditCard,
  IconClock,
  IconAlertCircle,
  IconTrendingUp,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../lib/api/CleintApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Payment() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedTenant, setSelectedTenant] = React.useState(null);
  const [auditLog, setAuditLog] = React.useState([]); 

  //  Load Audit Logs from DB on mount
  React.useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await api.get("/audit");
        setAuditLog(res.data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      }
    };
    fetchAuditLogs();
  }, []);

  //  Save audit log to DB + update local state
  const saveAuditLog = async (log) => {
    try {
      await api.post("/audit", log); // sends log to MongoDB
      setAuditLog((prev) => [log, ...prev]); // updates frontend instantly
    } catch (error) {
      console.error("Failed to save audit log:", error);
    }
  };

  //  Fetch tenants with populated property data
  const { data: tenants = [], isLoading, isError } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await api.get("/tenants");
      return res.data.alltenant;
    },
  });

  //  Update tenant payment status
  const updatePayment = useMutation({
    mutationFn: async ({ id, tenantsPayments }) => {
      const res = await api.put(`/tenants/${id}`, { tenantsPayments });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Payment status updated");
      queryClient.invalidateQueries(["tenants"]);

      //  Save audit log to DB
      const tenant = tenants.find((t) => t._id === variables.id);
      const newLog = {
        tenant: tenant?.fullName || "Unknown",
        action: `Updated payment status to "${variables.tenantsPayments}"`,
        date: new Date().toLocaleString(),
      };
      saveAuditLog(newLog);
    },
    onError: () => toast.error("Failed to update payment"),
  });

  //  Delete tenant
  const deleteTenant = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tenants/${id}`);
    },
    onSuccess: (_, id) => {
      toast.success("Tenant deleted successfully");
      queryClient.invalidateQueries(["tenants"]);
      setDeleteDialog(false);

      //  Save audit log to DB
      const tenant = tenants.find((t) => t._id === id);
      const newLog = {
        tenant: tenant?.fullName || "Unknown",
        action: "Deleted tenant record",
        date: new Date().toLocaleString(),
      };
      saveAuditLog(newLog);
    },
    onError: () => toast.error("Failed to delete tenant"),
  });

  //  Filter logic
  const filteredTenants = tenants?.filter((t) => {
    const matchesSearch =
      t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      t.propertyId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.propertyId?.address?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filter === "all" || t.tenantsPayments === filter;
    return matchesSearch && matchesStatus;
  });

  // Totals
  const paid = tenants?.filter((t) => t.tenantsPayments === "paid");
  const pending = tenants?.filter((t) => t.tenantsPayments === "pending");
  const overdue = tenants?.filter((t) => t.tenantsPayments === "overdue");

  const totalPaid = paid.reduce((sum, t) => sum + (t.propertyId?.amount || 0), 0);
  const totalPending = pending.reduce(
    (sum, t) => sum + (t.propertyId?.amount || 0),
    0
  );
  const totalOverdue = overdue.reduce(
    (sum, t) => sum + (t.propertyId?.amount || 0),
    0
  );

  //  Summary card component
  const SummaryCard = ({ title, color, amount, count }) => (
    <Card className={`from-${color}-50 to-card bg-gradient-to-t shadow-sm`}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className={`text-2xl font-semibold text-${color}-800`}>
          {isLoading ? "Loading..." : `$${amount.toLocaleString()}`}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground">
        {count} {title.toLowerCase()} payments
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      {/*  Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard title="Paid" color="green" amount={totalPaid} count={paid.length} />
        <SummaryCard title="Pending" color="yellow" amount={totalPending} count={pending.length} />
        <SummaryCard title="Overdue" color="rose" amount={totalOverdue} count={overdue.length} />
        <SummaryCard
          title="Total Income"
          color="blue"
          amount={totalPaid + totalPending + totalOverdue}
          count={tenants.length}
        />
      </div>

      {/*  Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between max-w-7xl mx-auto mt-12">
        <Input
          placeholder="Search by tenant or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/*  Table */}
      <div className="overflow-x-auto max-w-7xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No tenants found
                </TableCell>
              </TableRow>
            ) : (
              filteredTenants.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.fullName}</TableCell>
                  <TableCell>{t.propertyId?.title || "—"}</TableCell>
                  <TableCell>{t.propertyId?.address || "—"}</TableCell>
                  <TableCell>
                    ${t.propertyId?.amount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${
                        t.tenantsPayments === "paid"
                          ? "bg-green-100 text-green-800"
                          : t.tenantsPayments === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {t.tenantsPayments}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updatePayment.mutate({
                          id: t._id,
                          tenantsPayments:
                            t.tenantsPayments === "paid" ? "pending" : "paid",
                        })
                      }
                    >
                      <IconCheck className="size-4 mr-1" />
                      {t.tenantsPayments === "paid" ? "Mark Pending" : "Mark Paid"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedTenant(t);
                        setDeleteDialog(true);
                      }}
                    >
                      <IconTrash className="size-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/*  Delete Confirmation */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <b>{selectedTenant?.fullName}</b>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTenant.mutate(selectedTenant._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  Audit Log Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconClock className="size-5 text-muted-foreground" />
          Audit Log (Recent Actions)
        </h2>
        {auditLog.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent actions recorded.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.tenant}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
