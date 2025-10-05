import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { Bed, Bath, Ruler } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [open, setOpen] = useState(false);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading property details...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading property.</p>;

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const tenantsMutation= useMutation({
  mutationFn:async(formData)=>{
    const result = await api.post('/tenants',formData)
    return result.data
  },
  onSuccess:()=>{
    toast.success('Request sent successfully!')

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      message: "",
    });
     setOpen(false);
  },
  onError:(err)=>{
    toast.error('Error submitting request')
  }

  
})

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  tenantsMutation.mutate({
  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  message: formData.message,
 
})

  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg rounded-xl">
        {/* Image */}
        <CardHeader className="p-0">
          <img
            crossOrigin="anonymous"
            src={property.image}
            alt={property.title}
            className="w-full h-96 object-cover rounded-t-xl"
          />
        </CardHeader>

        {/* Property Info */}
        <CardContent className="p-6">
          <CardTitle className="text-3xl font-bold">{property.title}</CardTitle>
          <p className="text-gray-600 mt-2">{property.address}</p>
          <h2 className="text-2xl text-rose-600 mt-4">
            {property.currency} {property.amount} / {property.period}
          </h2>

          <div className="flex gap-6 mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" /> {property.bedrooms} Beds
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" /> {property.bathrooms} Baths
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5" /> {property.length}×{property.width}{" "}
              {property.unit}
            </div>
          </div>
        </CardContent>

        {/* Request Button with Dialog */}
        <CardFooter className="p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 text-white hover:bg-rose-700">
                Request as Tenant
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tenant Request Form</DialogTitle>
                <DialogDescription>
                  Please fill in your details to request this property.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Optional message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PropertyDetailPage;
