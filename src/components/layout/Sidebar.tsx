"use client";

import {
  LayoutDashboard,
  Users,
  Shield,
  ClipboardList,
  BarChart3,
  Upload,
  HelpCircle,
  Activity,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/layout/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: Users, label: "User Management" },
  { href: "/roles", icon: Shield, label: "Roles & Permissions" },
  { href: "/settings", icon: ClipboardList, label: "Create Task Settings" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-sidebar bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 lg:block">
          <div>
            <h1 className="text-lg font-bold text-brand-600">Atlum Admin</h1>
            <p className="text-xs font-medium text-sidebar-foreground opacity-70">
              Enterprise Console
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-sidebar-active lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="border-t border-border-sidebar p-4">
          <Button className="mb-4 w-full" size="sm">
            <Upload className="h-4 w-4" />
            Bulk Excel Import
          </Button>
          <div className="space-y-2">
            <NavLink href="/help" icon={HelpCircle} label="Help Center" />
            <div className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-sidebar-foreground">
              <Activity className="h-4 w-4 text-success" />
              <span>System Health</span>
              <span className="ml-auto h-2 w-2 rounded-full bg-success" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
