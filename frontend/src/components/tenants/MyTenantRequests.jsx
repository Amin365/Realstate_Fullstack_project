import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { HeroHeader } from "../LandPage/Navbar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const MyTenantRequests = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  // ✅ Fetch all tenant requests
  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ["my-tenant-requests"],
    queryFn: async () => (await api.get("/tenants")).data.alltenant,
  });

  // ✅ Filter requests
  const filteredRequests =
    requests?.filter((r) => {
      const matchesStatus =
        statusFilter === "all" ? true : r.status === statusFilter;
      const matchesSearch = r.propertyId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  // 🧹 Cancel Request Function
  const handleCancelRequest = async (req) => {
    try {
      await api.delete(`/tenants/${req._id}`);
      toast.success("Request canceled successfully.");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to cancel request.");
    }
  };

  // 🌀 Loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading requests...
      </div>
    );

  // ⚠️ Error state
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load your tenant requests.
      </p>
    );

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 🧭 Fixed Hero Header */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white">
        <HeroHeader />
      </div>

      <div className="pt-24 max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          My Tenant Requests
        </h1>

        {/* 🔍 Search + Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <Input
            placeholder="Search property..."
            className="w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 🧾 Request List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500">
            <img
              src="/empty-state.svg"
              alt="No requests"
              className="mx-auto w-40 mb-3"
            />
            <p>No tenant requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <Card
                key={req._id}
                className="hover:shadow-md transition bg-white"
              >
                <CardContent className="flex justify-between items-center p-4">
                  {/* 🏠 Property Info */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={req.propertyId?.image}
                      alt={req.propertyId?.title}
                      className="w-24 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {req.propertyId?.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {req.propertyId?.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* 🟢 Status + Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {req.tenantsPayments?.toLowerCase() === "paid" && (
                      <Badge className="bg-green-100 text-green-700">
                        Paid
                      </Badge>
                    )}

                    {/* 👁 View Details Dialog */}
                    <Dialog open={selectedTenant?._id === req._id} onOpenChange={(open) => !open && setSelectedTenant(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTenant(req)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tenant Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Name:</strong> {req.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {req.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {req.phone}
                          </p>
                          <p>
                            <strong>Message:</strong> {req.message || "N/A"}
                          </p>
                          <p>
                            <strong>Status:</strong> {req.status}
                          </p>
                          <p>
                            <strong>Payment:</strong> {req.tenantsPayments}
                          </p>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setSelectedTenant(null)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* ❌ Cancel Request Dialog */}
                    {req.tenantsPayments?.toLowerCase() === "pending" && (
                      <Dialog
                        open={confirmCancel?._id === req._id}
                        onOpenChange={(open) => !open && setConfirmCancel(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmCancel(req)}
                          >
                            Cancel Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Request?</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            Are you sure you want to cancel your request for{" "}
                            <strong>{req.propertyId?.title}</strong>?
                          </p>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setConfirmCancel(null)}
                            >
                              No, Keep
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleCancelRequest(req);
                                setConfirmCancel(null);
                              }}
                            >
                              Yes, Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTenantRequests;
