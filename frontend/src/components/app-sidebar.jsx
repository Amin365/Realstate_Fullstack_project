"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,

  IconUsers,
} from "@tabler/icons-react"

import { Link } from "react-router"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
   { title: "Properties", url: "/dashboard/properties", icon: IconListDetails },

    { title: "Tenants", url: "/dashboard/tenants", icon: IconChartBar },
    { title: "Payment", url: "/dashboard/payments", icon: IconFolder },
    { title: "Reports", url: "/dashboard/reports", icon: IconReport },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard/profile", icon: IconSettings },
   
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header / Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Waansan RealState</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <nav className="flex flex-col gap-1 p-2">
          {data.navMain.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-500"
            >
              <item.icon className="!size-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Footer / User */}
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  )
}
