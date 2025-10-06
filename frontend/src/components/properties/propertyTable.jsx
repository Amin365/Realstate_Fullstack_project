import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { toast } from "sonner";

const PropertyTable = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: properties, isLoading, isError, error } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/property");
      return res.data;
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/property/${id}`);
    },
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries(["property"]);
    },
    onError: () => toast.error("Failed to delete property"),
  });

  if (isLoading)
    return <p className="text-center mt-4">Loading properties...</p>;
  if (isError)
    return (
      <p className="text-center mt-4 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <Table className="w-full mt-6 shadow-md rounded-lg border">
        <TableCaption className="text-lg font-semibold">
          List of Properties
        </TableCaption>
        <TableHeader>
          <TableRow className="">
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Property Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No properties found.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property._id}>
                <TableCell>{property.title}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      property.status === "rented"
                        ? "bg-rose-100 text-rose-700 px-2"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell className="text-right">
                  {property.currency} {property.amount} / {property.period}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                          onClick={() => onEdit(property)}
                        >
                          <PencilLine size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Property</TooltipContent>
                    </Tooltip>

                    {/*  Delete Confirmation Dialog */}
                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">
                              <Trash2 size={18} />
                            </button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete Property</TooltipContent>
                      </Tooltip>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the property from your records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() =>
                              deleteProperty.mutate(property._id)
                            }
                          >
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default PropertyTable;
