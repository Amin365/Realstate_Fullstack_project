import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "../../lib/api/CleintApi";
import { extractErrorMessages } from "../../../../backend/util/GlobalEror";
import { toast } from "sonner";

const PropertyForm = ({ open, onOpenChange, property }) => {
  const initialFormValue = {
    title: "",
    amount: "",
    period: "month", // ✅ match schema
    currency: "BIRR",
    propertyType: "Apartment",
    status: "For Sale",
    address: "",
    city: "",
    state: "",
    bedrooms: 0,
    bathrooms: 0,
    length: 0, // ✅ match schema
    width: 0,  // ✅ match schema
    unit: "m²", // ✅ match schema
    isFavorite: false,
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const isEdit = Boolean(property);

  useEffect(() => {
    if (isEdit) {
      setFormValue({
        title: property.title || "",
        amount: property.amount || "",
        period: property.period || "month",
        currency: property.currency || "BIRR",
        propertyType: property.propertyType || "Apartment",
        status: property.status || "For Sale",
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        length: property.length || 0,
        width: property.width || 0,
        unit: property.unit || "m²",
        isFavorite: property.isFavorite || false,
      });
      setImageFile(null);
      setError("");
    } else {
      setFormValue(initialFormValue);
      setImageFile(null);
      setError("");
    }
  }, [property, open]);

  const handleClose = () => {
    setFormValue(initialFormValue);
    setImageFile(null);
    setError("");
    onOpenChange(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const mutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      if (id) {
        return await api.put(`/property/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return await api.post("/property", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["property"]);
      toast.success(isEdit ? "Property updated successfully!" : "Property created successfully!");
      onOpenChange(false);
    },
    onError: (err) => extractErrorMessages(err, setError),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(formValue).forEach(([key, val]) => {
      // Ensure numeric fields are numbers
      if (["amount", "bedrooms", "bathrooms", "length", "width"].includes(key)) {
        formData.append(key, val === "" ? 0 : Number(val));
      } else {
        formData.append(key, val);
      }
    });

    if (imageFile) formData.append("image", imageFile);

    mutation.mutate({ formData, id: property?._id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{isEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>Fill in all required fields to add a property.</DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={formValue.title} onChange={handleChange} required />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Property Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price *</Label>
            <div className="flex gap-2">
              <Input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formValue.amount}
                onChange={handleChange}
                required
              />
              <Select
                value={formValue.period}
                onValueChange={(v) => handleChange({ target: { name: "period", value: v } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
              <Input name="currency" value={formValue.currency} onChange={handleChange} />
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Property Type</Label>
              <Select
                value={formValue.propertyType}
                onValueChange={(v) => handleChange({ target: { name: "propertyType", value: v } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formValue.status}
                onValueChange={(v) => handleChange({ target: { name: "status", value: v } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location *</Label>
            <div className="flex gap-2">
              <Input name="address" placeholder="Street Address" value={formValue.address} onChange={handleChange} required />
              <Input name="city" placeholder="City" value={formValue.city} onChange={handleChange} required />
              <Input name="state" placeholder="State" value={formValue.state} onChange={handleChange} required />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label>Details *</Label>
            <div className="flex gap-2">
              <Input name="bedrooms" type="number" placeholder="Bedrooms" value={formValue.bedrooms} onChange={handleChange} required />
              <Input name="bathrooms" type="number" placeholder="Bathrooms" value={formValue.bathrooms} onChange={handleChange} required />
              <Input name="length" type="number" placeholder="Length" value={formValue.length} onChange={handleChange} />
              <Input name="width" type="number" placeholder="Width" value={formValue.width} onChange={handleChange} />
              <Input name="unit" placeholder="Unit" value={formValue.unit} onChange={handleChange} />
            </div>
          </div>

          {/* Favorite */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFavorite"
              name="isFavorite"
              checked={formValue.isFavorite}
              onCheckedChange={(v) => handleChange({ target: { name: "isFavorite", checked: v } })}
            />
            <Label htmlFor="isFavorite">Mark as Favorite</Label>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Saving..." : isEdit ? "Update Property" : "Add Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
