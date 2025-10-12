import  { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";
import { Heart, Bed, Bath, Ruler, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroHeader } from "../LandPage/Navbar";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { toggleFavorite } from "../../lib/Reduxs/favoritesSlice";

const PropertyCard = () => {
  const [filters, setFilters] = useState({
    location: "any",
    propertyType: "any",
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/properties");
      return res.data;
    },
  });

  const uniqueLocations = properties
    ? [...new Set(properties.map((p) => p.address?.split(",")[0] || "Unknown"))]
    : [];

  const filteredProperties = properties
    ? properties.filter((p) => {
        const matchesLocation =
          filters.location === "any"
            ? true
            : p.address?.toLowerCase().includes(filters.location.toLowerCase());
        const matchesType =
          filters.propertyType === "any"
            ? true
            : p.propertyType === filters.propertyType;
        return matchesLocation && matchesType;
      })
    : [];

    const dispatch = useDispatch();
     const favorites = useSelector((state) => state.favorites?.items || []);
    
     const isFavorite = (id) => favorites.some((item) => item._id === id);
    

  return (
    <>
      <HeroHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 mt-20">
          <h1 className="text-2xl font-bold text-center mb-5">
            Based on Your Location
          </h1>
          <p className="text-center text-gray-400 mb-5">
            Find the best properties available in your area.
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Filter className="h-5 w-5" /> Filter Properties
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Location */}
            <Select
              value={filters.location}
              onValueChange={(val) => setFilters({ ...filters, location: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {uniqueLocations.map((loc, idx) => (
                  <SelectItem key={idx} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Property Type */}
            <Select
              value={filters.propertyType}
              onValueChange={(val) =>
                setFilters({ ...filters, propertyType: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <Card
                key={idx}
                className="overflow-hidden rounded-2xl shadow-md animate-pulse"
              >
                <div className="bg-gray-200 h-56 w-full" />
                <CardContent className="p-5 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Link key={property._id} to={`/propertydetails/${property._id}`}>
                <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                  <CardHeader className="p-0 relative">
                    <img
                      crossOrigin="anonymous"
                      src={property.image}
                      alt="Property"
                      className="w-full h-60 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleFavorite(property));
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow transition ${isFavorite(property._id)
                        ? "bg-rose-500 text-white"
                        : "bg-white/70 text-rose-500"
                        }`}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </CardHeader>

                  <CardContent className="p-3">
                    <h2 className="text-xl font-bold text-rose-600">
                      {property.currency} {property.amount}
                      <span className="text-gray-500 text-base">
                        /{property.period}
                      </span>
                    </h2>
                    <h3 className="text-lg font-semibold text-gray-800 mt-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{property.address}</p>
                  </CardContent>

                  <CardFooter className="border-t px-5 py-4 flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {property.bedrooms || 0} Beds
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {property.bathrooms || 0}{" "}
                      Baths
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" /> {property.length}×
                      {property.width} {property.unit}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No properties found for this filter.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
