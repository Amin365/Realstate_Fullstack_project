import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilLine, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { toast } from "sonner";

const TenantTable = () => {
  const queryClient = useQueryClient();

  // Fetch tenants
const { data: tenants, isLoading, isError, error } = useQuery({
  queryKey: ["tenants"],
  queryFn: async () => {
    const res = await api.get("/tenants");
    return res.data.alltenant; // ✅ correct property name
  },
});


  console.log('tenants', tenants )

  // Delete tenant mutation
  // const deleteTenant = useMutation({
  //   mutationFn: async (id) => {
  //     await api.delete(`/tenants/${id}`);
  //   },
  //   onSuccess: () => {
  //     toast.success("Tenant deleted successfully");
  //     queryClient.invalidateQueries(["tenants"]); 
  //   },
  //   onError: () => toast.error("Failed to delete tenant"),
  // });

  // if (isLoading) return <p className="text-center mt-4">Loading Tenants...</p>;
  // if (isError)
  //   return <p className="text-center mt-4 text-red-500">Error: {error.message}</p>;

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
            <TableHead className="text-right">Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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
                <TableCell>{t?.phone}</TableCell>
                <TableCell>{t?.email}</TableCell>
                <TableCell className="text-right">{t?.message}</TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition">
                          <PencilLine size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Tenant</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => deleteTenant.mutate(t._id)}
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
    </div>
  );
};

export default TenantTable;
