
// src/components/layout/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ArrowRightLeft, Settings, Sigma, BeakerIcon, LineChart, FlaskConical, Atom, Landmark } from "lucide-react"; // Added Landmark
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/converter", label: "Converter", icon: ArrowRightLeft },
  { href: "/advanced-calculator", label: "Advanced Calc", icon: BeakerIcon },
  { href: "/graphing", label: "Graphing", icon: LineChart },
  { href: "/chemistry", label: "Chemistry", icon: FlaskConical },
  { href: "/physics", label: "Physics", icon: Atom },
  { href: "/banking", label: "Banking", icon: Landmark }, // New Banking item
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 justify-center items-center">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
          <Sigma className="h-8 w-8" />
          <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">OmniCalc</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right", align: "center" }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        {/* You can add footer items here if needed */}
        <p className="text-xs text-sidebar-foreground/70 text-center group-data-[collapsible=icon]:hidden">
          &copy; {new Date().getFullYear()} OmniCalc
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

