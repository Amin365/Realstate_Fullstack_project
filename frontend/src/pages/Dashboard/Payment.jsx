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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Payment() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState(null);

  // ✅ Fetch properties
  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/property");
      return res.data;
    },
  });

  // ✅ Mutation: Update payment status instantly
  const updatePayment = useMutation({
    mutationFn: async ({ id, paymentStatus }) => {
      const res = await api.put(`/property/${id}`, { paymentStatus });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment status updated");
      queryClient.invalidateQueries(["property"]);
    },
    onError: () => toast.error("Failed to update payment"),
  });

  // ✅ Mutation: Delete property
  const deleteProperty = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/property/${id}`);
    },
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries(["property"]);
      setDeleteDialog(false);
    },
    onError: () => toast.error("Failed to delete property"),
  });

  // ✅ Filter logic
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "all" || p.paymentStatus === filter;
    return matchesSearch && matchesStatus;
  });

  // ✅ Totals
  const paid = properties.filter((p) => p.paymentStatus === "paid");
  const pending = properties.filter((p) => p.paymentStatus === "pending");
  const overdue = properties.filter((p) => p.paymentStatus === "overdue");

  const totalPaid = paid.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOverdue = overdue.reduce((sum, p) => sum + (p.amount || 0), 0);

  // ✅ Top Summary Cards
  const SummaryCard = ({ title, color, amount, count, icon: Icon }) => (
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard title="Paid" color="green" amount={totalPaid} count={paid.length} icon={IconCreditCard} />
        <SummaryCard title="Pending" color="yellow" amount={totalPending} count={pending.length} icon={IconClock} />
        <SummaryCard title="Overdue" color="rose" amount={totalOverdue} count={overdue.length} icon={IconAlertCircle} />
        <SummaryCard
          title="Total Income"
          color="blue"
          amount={totalPaid + totalPending + totalOverdue}
          count={properties.length}
          icon={IconTrendingUp}
        />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Input
          placeholder="Search by title or address..."
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

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tenant</TableHead>
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
            ) : filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell>{p.fullName || "—"}</TableCell>
                  <TableCell>${p.amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${
                        p.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : p.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {p.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updatePayment.mutate({
                          id: p._id,
                          paymentStatus: p.paymentStatus === "paid" ? "pending" : "paid",
                        })
                      }
                    >
                      <IconCheck className="size-4 mr-1" />
                      {p.paymentStatus === "paid" ? "Mark Pending" : "Mark Paid"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedProperty(p);
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

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <b>{selectedProperty?.title}</b>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteProperty.mutate(selectedProperty._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
