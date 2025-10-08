import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { Bed, Bath, Ruler, Loader2 } from "lucide-react";
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
  const { user } = useSelector((state) => state.auth); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [open, setOpen] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);


  // ✅ Fetch Property
  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
  });

 
  const {
    data: myRequests,
    isLoading: isLoadingRequests,
  } = useQuery({
    queryKey: ["my-tenant-requests"],
    queryFn: async () => (await api.get("/tenants")).data.alltenant,
    enabled: !!user, // only if logged in
    
  });

  console.log('myRequests',myRequests)
  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Tenant Mutation (Create tenant + update property)
  const tenantsMutation = useMutation({
    mutationFn: async (formData) => {
      const result = await api.post("/tenants", formData);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Request sent successfully!");

      // reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });

      setOpen(false);
        setShowSuccessCard(true); 
      queryClient.invalidateQueries(["property", id]);
      queryClient.invalidateQueries(["my-tenant-requests"]);

      // Redirect after 4s
      setTimeout(() => {
        navigate("/"); // redirect to home or main page
      }, 4000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error submitting request");
    },
  });

  // ✅ Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    tenantsMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      propertyId: property._id,
    });
  };

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      {isLoading && <p className="text-center">Loading property details...</p>}
      {isError && (
        <p className="text-center text-red-500">Error loading property.</p>
      )}

      {property && (
        <Card className="shadow-lg rounded-xl">
          {/* 🏠 Property Image */}
          <CardHeader className="p-0">
            <img
              crossOrigin="anonymous"
              src={property?.image}
              alt={property?.title}
              className="w-full h-96 object-cover rounded-t-xl"
            />
          </CardHeader>

          {/* 🧾 Property Info */}
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

          {/* 💬 Request Button */}
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

              {/* 🧾 Tenant Request Form */}
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Tenant Request Form</DialogTitle>
                  <DialogDescription>
                    Please fill in your details to request this property.
                  </DialogDescription>
                </DialogHeader>

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
                    {tenantsMutation.isPending
                      ? "Submitting..."
                      : "Submit Request"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}

      {/* 🧠 Activity Log Section */}
      {user && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Your Recent Tenant Requests
          </h2>

          {isLoadingRequests ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5" /> Loading your activity...
            </div>
          ) : myRequests && myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.slice(0, 3).map((req) => (
                <Card
                  key={req._id}
                  className="border shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={req.propertyId?.image}
                        alt={req.propertyId?.title}
                        className="w-20 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {req.propertyId?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {req.propertyId?.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {req.propertyId?.currency} {req.propertyId?.amount}/
                          {req.propertyId?.period}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          req.status === "avaliable"
                            ? "bg-green-100 text-green-700"
                            : req.status === "rented"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              You haven’t submitted any tenant requests yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
