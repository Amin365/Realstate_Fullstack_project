import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import {
  Bed,
  Bath,
  Ruler,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
import axios from "axios";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
    paymentMethod: "cash", // default
  });
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successPage, setSuccessPage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch property details
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => (await api.get(`/properties/${id}`)).data,
  });

  // ✅ Tenant creation mutation
  const tenantMutation = useMutation({
    mutationFn: async (data) => await api.post("/tenants", data),
    onSuccess: (res) => {
      toast.success("Tenant request submitted successfully!");
      queryClient.invalidateQueries(["property", id]);
      setProgress(100);
      setSuccessPage(true);
      setTimeout(() => navigate("/"), 4000);
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Failed to submit request");
      toast.error("Error submitting request");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submission for Cash / Online
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.paymentMethod === "cash") {
      // Save immediately with pending status
      tenantMutation.mutate({
        ...formData,
        propertyId: property._id,
        status: "pending",
      });
      animateProgress();
    } else {
      // Online → Initialize Chapa payment
      try {
        const response = await axios.post(
          "http://localhost:4800/api/payments/initialize",
          {
            amount: property?.amount,
            email: formData.email,
            first_name: formData.fullName.split(" ")[0],
            last_name: formData.fullName.split(" ")[1] || "User",
            propertyId: property._id,
            fullName: formData.fullName,
            phone: formData.phone,
          }
        );

        window.location.href = response.data.checkout_url;
      } catch (err) {
        toast.error("Payment initialization failed!");
        console.error(err);
      }
    }
  };

  const animateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += 2;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 40);
  };

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

  // ✅ Payment Success Page (for after online payment redirect)
  if (successPage) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <Card className="p-10 text-center shadow-xl animate-fade-in border border-green-300">
          <CheckCircle className="mx-auto text-green-600 w-16 h-16 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Tenant Request Saved Successfully!
          </h2>
          <p className="text-gray-700 mb-4">
            Your request has been recorded. Redirecting you home...
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-2 transition-all duration-500 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-3xl font-bold">{property?.title}</CardTitle>
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
                  : "Register & Pay"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tenant Registration & Payment</DialogTitle>
                <DialogDescription>
                  Fill in your details and choose how to pay.
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

                {/* ✅ Payment Method */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleChange}
                      />
                      Cash (Pay later)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={handleChange}
                      />
                      Online (Chapa)
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={tenantMutation.isPending}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {tenantMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
                  ) : null}
                  {formData.paymentMethod === "cash"
                    ? "Submit & Save"
                    : "Proceed to Chapa"}
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
