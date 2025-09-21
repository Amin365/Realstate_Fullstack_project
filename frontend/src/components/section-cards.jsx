import * as React from "react";
import { IconHome, IconBuilding, IconUsers, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "../lib/api/CleintApi";
import { useQuery } from "@tanstack/react-query";

export function SectionCards() {
  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await api.get("/properties");
      return res.data; // should be an array
    },
  });

  // Dates for filtering
  const now = new Date();
  const currentMonth = now.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  // Total Properties
  const totalProperties = properties.length;
  const totalPrevious = properties.filter(
    (p) => new Date(p.createdAt).getMonth() === previousMonth
  ).length;
  const totalGrowth = totalPrevious > 0
    ? (((totalProperties - totalPrevious) / totalPrevious) * 100).toFixed(1)
    : 0;

  // Active Rentals (status === "Rented")
  const activeRentals = properties.filter((p) => p.status === "For Rent").length;
  const activeRentalsPrevious = properties.filter(
    (p) => p.status === "Rented" && new Date(p.createdAt).getMonth() === previousMonth
  ).length;
  const activeRentalsGrowth = activeRentalsPrevious > 0
    ? (((activeRentals - activeRentalsPrevious) / activeRentalsPrevious) * 100).toFixed(1)
    : 0;

  // New Listings this month
 // Calculate total amount
const totalAmount = properties.reduce((sum, p) => sum + (p.amount || 0), 0);

// Total amount for previous month
const totalAmountPrevious = properties
  .filter(p => new Date(p.createdAt).getMonth() === previousMonth)
  .reduce((sum, p) => sum + (p.amount || 0), 0);

// Growth %
const totalAmountGrowth = totalAmountPrevious > 0
  ? (((totalAmount - totalAmountPrevious) / totalAmountPrevious) * 100).toFixed(1)
  : 0;


  // Occupancy Rate
  const occupancyRate = totalProperties > 0 ? ((activeRentals / totalProperties) * 100).toFixed(1) : 0;
  const previousOccupancyRate = totalPrevious > 0 ? ((activeRentalsPrevious / totalPrevious) * 100).toFixed(1) : 0;
  const occupancyGrowth = previousOccupancyRate > 0 ? (occupancyRate - previousOccupancyRate).toFixed(1) : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Total Properties */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? "Loading..." : isError ? 0 : totalProperties}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {totalGrowth > 0 ? `+${totalGrowth}%` : `${totalGrowth}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New listings this month <IconBuilding className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all regions
          </div>
        </CardFooter>
      </Card>

      {/* New Listings */}
     

      {/* Active Rentals */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Rentals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeRentals}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {activeRentalsGrowth > 0 ? `+${activeRentalsGrowth}%` : `${activeRentalsGrowth}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Monthly occupancy rate <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Steady growth in tenants</div>
        </CardFooter>
      </Card>

     <Card className="@container/card">
  <CardHeader>
    <CardDescription>Total Income</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
      {isLoading ? "Loading..." : isError ? 0 : totalAmount.toLocaleString()}
    </CardTitle>
    <CardAction>
      <Badge variant="outline">
        <IconTrendingUp />
        {totalAmountGrowth > 0 ? `+${totalAmountGrowth}%` : `${totalAmountGrowth}%`}
      </Badge>
    </CardAction>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      Compared to last month <IconHome className="size-4" />
    </div>
    <div className="text-muted-foreground">
      Sum of property amounts
    </div>
  </CardFooter>
</Card>


      {/* Occupancy Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Occupancy Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {occupancyRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {occupancyGrowth > 0 ? `+${occupancyGrowth}%` : `${occupancyGrowth}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared to previous month <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Healthy occupancy levels</div>
        </CardFooter>
      </Card>

    </div>
  );
}
