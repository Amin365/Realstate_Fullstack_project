"use client"

import * as React from "react"
import { IconHome, IconBuilding, IconUsers, IconTrendingUp  } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Total Properties */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,520
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp  />
              +8%
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Listings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            120
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp  />
              +10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared to last month <IconHome className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Available for sale or rent
          </div>
        </CardFooter>
      </Card>

      {/* Active Rentals */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Rentals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            850
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp  />
              +5%
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

      {/* Occupancy Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Occupancy Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            92%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp  />
              +2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared to previous quarter <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Healthy occupancy levels</div>
        </CardFooter>
      </Card>

    </div>
  )
}
