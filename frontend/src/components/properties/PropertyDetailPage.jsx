import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { Bed, Bath, Ruler, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
import { useSelector } from "react-redux";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth); // 🧩 D: Auto-fill user data

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch Property
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => (await api.get(`/properties/${id}`)).data,
  });

  // ✅ Tenant Request Mutation
  const tenantsMutation = useMutation({
    mutationFn: async (formData) => {
      const result = await api.post("/tenants", formData);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Request sent successfully!");
      setFormData({ fullName: "", email: "", phone: "", message: "" });
      setOpen(false);
      setShowSuccessCard(true);
      queryClient.invalidateQueries(["property", id]);

      // ⏳ Animate redirect progress bar
      let value = 0;
      const interval = setInterval(() => {
        value += 1;
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          navigate("/");
        }
      }, 40); // 4 seconds total
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Failed to send request");
      toast.error(err.response?.data?.message || "Error submitting request");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    tenantsMutation.mutate({
      ...formData,
      propertyId: property._id,
    });
  };

  // ✅ Success Screen
  if (showSuccessCard) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <Card className="p-10 text-center shadow-lg border border-green-200 animate-fade-in">
          <CheckCircle className="mx-auto text-green-600 w-14 h-14" />
          <CardHeader>
            <CardTitle className="text-green-600 text-2xl font-semibold">
              Request Submitted Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mt-2">
              You’ll be redirected to the main page shortly.
            </p>
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-green-100 h-2 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Loading State
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-rose-600 w-8 h-8" />
        <p className="ml-2 text-gray-500">Loading property details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <AlertCircle className="mr-2" /> Failed to load property.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg rounded-xl">
        {/* Property Image */}
        <CardHeader className="p-0">
          <img
            crossOrigin="anonymous"
            src={property?.image}
            alt={property?.title}
            className="w-full h-96 object-cover rounded-t-xl"
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              {property?.title}
            </CardTitle>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                property?.status === "rented"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {property?.status?.toUpperCase()}
            </span>
          </div>

          <p className="text-gray-600 mt-2">{property?.address}</p>
          <h2 className="text-2xl text-rose-600 mt-4">
            {property?.currency} {property?.amount} / {property?.period}
          </h2>

          <div className="flex gap-6 mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" /> {property?.bedrooms} Beds
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" /> {property?.bathrooms} Baths
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5" /> {property?.length}×{property?.width}{" "}
              {property?.unit}
            </div>
          </div>
        </CardContent>

        {/* Request Button */}
        <CardFooter className="p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-rose-600 text-white hover:bg-rose-700"
                disabled={property?.status === "rented"}
              >
                {property?.status === "rented"
                  ? "Already Rented"
                  : "Request as Tenant"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tenant Request Form</DialogTitle>
                <DialogDescription>
                  Fill in your information to request this property.
                </DialogDescription>
              </DialogHeader>

              {errorMsg && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-3">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={tenantsMutation.isPending}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {tenantsMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
                  ) : null}
                  {tenantsMutation.isPending ? "Submitting..." : "Submit Request"}
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
