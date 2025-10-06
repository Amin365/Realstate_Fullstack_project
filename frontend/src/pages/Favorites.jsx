import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.items);
  console.log("Favorites page state:", favorites);

  if (!favorites) {
    return <p className="text-gray-500 text-center py-20">Loading favorites...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Your Favorite Properties ❤️
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center">No favorites yet ❤️</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <Link key={property._id} to={`/propertydetails/${property._id}`}>
              <Card className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
                <CardHeader className="p-0">
                  <img
                    src={property.image || "/placeholder.jpg"}
                    alt={property.title || "Property"}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h2 className="font-bold text-lg">{property.title}</h2>
                  <p className="text-gray-500">{property.address}</p>
                  <p className="text-rose-500 font-semibold mt-1">
                    {property.currency || "$"} {property.amount} / {property.period}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
