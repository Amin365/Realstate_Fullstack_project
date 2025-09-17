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

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { extractErrorMessages } from "../../../../backend/util/GlobalEror";

const PropertyForm = ({ open, onOpenChange }) => {
 const initialFormValue = {
    title: "",
    price: { amount: "", period: "month", currency: "BIRR" },
    propertyType: "Apartment",
    status: "For Sale",
    location: { address: "", city: "", state: "" },
    details: { bedrooms: "", bathrooms: "", area: { length: "", width: "", unit: "m²" } },
    isFavorite: false,}


  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const [formValue, setFormValue] = useState({
    title: "",
    price: { amount: "", period: "month", currency: "BIRR" },
    propertyType: "Apartment",
    status: "For Sale",
    location: { address: "", city: "", state: "" },
    details: { bedrooms: "", bathrooms: "", area: { length: "", width: "", unit: "m²" } },
    isFavorite: false,
  });

   const handleClose = () => {
    setFormValue(initialFormValue);
    setImageFile(null);
    setError("");
    onOpenChange(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormValue((prev) => {
      if (name.startsWith("price.")) {
        return { ...prev, price: { ...prev.price, [name.split(".")[1]]: value } };
      }
      if (name.startsWith("location.")) {
        return { ...prev, location: { ...prev.location, [name.split(".")[1]]: value } };
      }
      if (name.startsWith("details.")) {
        return {
          ...prev,
          details: {
            ...prev.details,
            [name.split(".")[1]]:
              name.includes("area")
                ? { ...prev.details.area, [name.split(".")[2]]: value }
                : value,
          },
        };
      }
      if (name === "isFavorite") return { ...prev, isFavorite: checked };

      if (name === "propertyType") {
  return {
    ...prev,
    propertyType: value // ← move to root, not inside price
  };
}
if (name === "status") {
  return {
    ...prev,
    status: value 
  };
}
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);
const queryclient=useQueryClient()
  const PropertyMutation = useMutation({
    mutationFn: async (ProData) => {
      const response = await api.post("/property", ProData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () =>{
        queryclient.invalidateQueries(['property'])
        onOpenChange(false)

    } ,
    onError: (err) => extractErrorMessages(err, setError),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", formValue.title);
    formData.append("price.amount", formValue.price.amount);
    formData.append("price.period", formValue.price.period);
    formData.append("price.currency", formValue.price.currency);
    formData.append("propertyType", formValue.propertyType);
    formData.append("status", formValue.status);
    formData.append("location.address", formValue.location.address);
    formData.append("location.city", formValue.location.city);
    formData.append("location.state", formValue.location.state);
    formData.append("details.bedrooms", formValue.details.bedrooms);
    formData.append("details.bathrooms", formValue.details.bathrooms);
    formData.append("details.area.length", formValue.details.area.length);
    formData.append("details.area.width", formValue.details.area.width);
    formData.append("details.area.unit", formValue.details.area.unit);
    formData.append("isFavorite", formValue.isFavorite);

    if (imageFile) formData.append("image", imageFile);

    PropertyMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Property</DialogTitle>
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
            <Label htmlFor="image">Property Image *</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange}  />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price *</Label>
            <div className="flex gap-2">
              <Input
                name="price.amount"
                type="number"
                placeholder="Amount"
                value={formValue.price.amount}
                onChange={handleChange}
                required
              />
              <Select value={formValue.price.period} onValueChange={(v) => handleChange({ target: { name: "price.period", value: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
              <Input name="price.currency" value={formValue.price.currency} onChange={handleChange} />
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Property Type</Label>
              <Select value={formValue.propertyType} onValueChange={(v) => handleChange({ target: { name: "propertyType", value: v } })}>
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
              <Select value={formValue.status} onValueChange={(v) => handleChange({ target: { name: "status", value: v } })}>
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
            <Input name="location.address" placeholder="Street Address" value={formValue.location.address} onChange={handleChange} required />
            <div className="flex gap-2">
              <Input name="location.city" placeholder="City" value={formValue.location.city} onChange={handleChange} required />
              <Input name="location.state" placeholder="State" value={formValue.location.state} onChange={handleChange} required />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label>Details *</Label>
            <div className="flex gap-2">
              <Input name="details.bedrooms" type="number" placeholder="Bedrooms" value={formValue.details.bedrooms} onChange={handleChange} required />
              <Input name="details.bathrooms" type="number" placeholder="Bathrooms" value={formValue.details.bathrooms} onChange={handleChange} required />
            </div>
            <div className="flex gap-2">
              <Input name="details.area.length" type="number" placeholder="Length" value={formValue.details.area.length} onChange={handleChange} />
              <Input name="details.area.width" type="number" placeholder="Width" value={formValue.details.area.width} onChange={handleChange} />
              <Input name="details.area.unit" value={formValue.details.area.unit} onChange={handleChange} />
            </div>
          </div>

          {/* Favorite */}
          <div className="flex items-center gap-2">
            <Checkbox id="isFavorite" name="isFavorite" checked={formValue.isFavorite} onCheckedChange={(v) => handleChange({ target: { name: "isFavorite", checked: v } })} />
            <Label htmlFor="isFavorite">Mark as Favorite</Label>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={PropertyMutation.isLoading}>
              {PropertyMutation.isLoading ? "Saving..." : "Add Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
