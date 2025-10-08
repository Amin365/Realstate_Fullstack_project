import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilLine, Trash2, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TenantTable = () => {
  const queryClient = useQueryClient();

  // Fetch tenants with property details
  const { data: tenants, isLoading, isError, error } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await api.get("/alltenants");
      return res.data.alltenant;
    },
  });

  // State for editing tenants
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    message: "",
    status: "",
    paymentStatus:""
  });

  // State for delete
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // State for property view dialog
  const [openPropertyView, setOpenPropertyView] = useState(false);
  const [propertyData, setPropertyData] = useState(null);

  // Mutations
  const updateTenant = useMutation({
    mutationFn: async (tenant) => {
      const res = await api.put(`/tenants/${tenant._id}`, tenant);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tenant updated successfully");
      queryClient.invalidateQueries(["tenants"]);
      setOpenEdit(false);
    },
    onError: () => toast.error("Failed to update tenant"),
  });

  const deleteTenant = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tenants/${id}`);
    },
    onSuccess: () => {
      toast.success("Tenant deleted successfully");
      queryClient.invalidateQueries(["tenants"]);
      setOpenDelete(false);
    },
    onError: () => toast.error("Failed to delete tenant"),
  });

  // Handlers
  const handleEditClick = (tenant) => {
    setEditData(tenant);
    setOpenEdit(true);
  };

  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setOpenDelete(true);
  };

  const handlePropertyView = (property) => {
    setPropertyData(property);
    setOpenPropertyView(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTenant.mutate(editData);
  };

  if (isLoading) return <p className="text-center mt-4">Loading Tenants...</p>;
  if (isError)
    return (
      <p className="text-center mt-4 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <Table className="w-full mt-6 shadow-md rounded-lg border">
        <TableCaption className="text-lg font-semibold">
          List of Tenants
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Property Details</TableHead>
            <TableHead>Payment Status</TableHead>
           
            <TableHead className="text-right">Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No Tenants found.
              </TableCell>
            </TableRow>
          ) : (
            tenants?.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.fullName}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status === "rented"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t.status || "pending"}
                  </span>
                </TableCell>
                <TableCell>{t.phone}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePropertyView(t.propertyId)}
                  >
                    {t.propertyId?.title || "N/A"} <Eye size={16} className="ml-1" />
                  </Button>
                </TableCell>
                 <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.tenantsPayments === "paid"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t.tenantsPayments || "pending"}
                  </span>
                </TableCell>
               
                <TableCell className="text-right">{t.message}</TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    {/* Edit Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleEditClick(t)}
                          className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                        >
                          <PencilLine size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Tenant</TooltipContent>
                    </Tooltip>

                    {/* Delete Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDeleteClick(t)}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Tenant</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Input
                value={editData.message}
                onChange={(e) =>
                  setEditData({ ...editData, message: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="border rounded-md w-full p-2"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="available">available</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>paymentStatus</Label>
              <select
                className="border rounded-md w-full p-2"
                value={editData.tenantsPayments}
                onChange={(e) =>
                  setEditData({ ...editData, tenantsPayments: e.target.value })
                }
              >
                
                <option value="paid">paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              Update Tenant
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedTenant?.fullName}</span>?
            </p>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              className="bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteTenant.mutate(selectedTenant._id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Property View Dialog */}
      <Dialog open={openPropertyView} onOpenChange={setOpenPropertyView}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
          </DialogHeader>
          {propertyData && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {propertyData.title}</p>
              <p><strong>Location:</strong> {propertyData.address}</p>
              <p><strong>Status:  </strong><span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      propertyData?.status === "rented"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {propertyData?.status || "N/A"}
                  </span></p>
               
              <p><strong>Amount:</strong> {propertyData.currency} {propertyData.amount} / {propertyData.period}</p>
              <p><strong>Created At:</strong> {new Date(propertyData.createdAt).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter className="flex justify-end">
            <Button onClick={() => setOpenPropertyView(false)} className="bg-rose-600 hover:bg-rose-700 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantTable;
