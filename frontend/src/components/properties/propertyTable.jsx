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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";

const PropertyTable = ({ onEdit }) => {
  const { data: properties, isLoading, isError, error } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/property");
      return res.data;
    },
  });

  console.log("proper",properties)

  if (isLoading) return <p className="text-center mt-4">Loading properties...</p>;
  if (isError) return <p className="text-center mt-4 text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <Table className="w-full mt-6 shadow-md rounded-lg border">
        <TableCaption className="text-lg font-semibold">List of Properties</TableCaption>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    property.status === "For Sale"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
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
                        <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                          onClick={() => onEdit(property)}>
                          <PencilLine size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Property</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">
                          <Trash2 size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Property</TooltipContent>
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

export default PropertyTable;
