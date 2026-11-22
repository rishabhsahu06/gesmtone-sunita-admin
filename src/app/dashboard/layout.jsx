"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider className="max-w-[100vw] overflow-x-hidden">
      <AppSidebar />
      <SidebarInset className="min-w-0 max-w-full overflow-x-hidden">
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex min-w-0 items-center gap-2 px-3 sm:px-4">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex min-w-0 max-w-full flex-1 flex-col gap-4 overflow-x-hidden p-3 pt-0 sm:p-4 sm:pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
