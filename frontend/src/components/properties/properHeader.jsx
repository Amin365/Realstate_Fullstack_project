import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";

const ProperHeader = ({ onOpenChange }) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/property");
      return res.data;
    },
  });

  return (
    <div>
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex flex-col items-start">
            <CardTitle className="text-2xl">
              Welcome to Real Estate Management
            </CardTitle>
            <CardDescription className="text-base">
              Here you can manage your properties, add new listings, and update existing ones.
            </CardDescription>
          </div>
          {/* Trigger parent state */}
          <Button onClick={() => onOpenChange(null)}>Add New Property</Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProperHeader;
