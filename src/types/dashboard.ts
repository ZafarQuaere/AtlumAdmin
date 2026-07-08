export type UserRole = "admin" | "manager" | "employee";

export interface DashboardStats {
  totalEmployees: { value: number; change: number };
  activeManagers: { value: number; status: string };
  systemHealth: {
    uptime: string;
    latency: string;
    errors: number;
    status: string;
  };
}

export interface RecentAction {
  id: string;
  title: string;
  timestamp: string;
  category: string;
  icon: "user" | "settings" | "shield" | "file" | "check";
}

export interface ProductivityDataPoint {
  day: string;
  value: number;
}

export const mockDashboardStats: DashboardStats = {
  totalEmployees: { value: 1284, change: 4.2 },
  activeManagers: { value: 156, status: "Stable" },
  systemHealth: {
    uptime: "99.98%",
    latency: "12ms",
    errors: 0,
    status: "Active",
  },
};

export const mockRecentActions: RecentAction[] = [
  {
    id: "1",
    title: "New Employee added: Jordan S",
    timestamp: "2 mins ago",
    category: "HR Dept",
    icon: "user",
  },
  {
    id: "2",
    title: "System Config updated by Admin",
    timestamp: "45 mins ago",
    category: "Settings",
    icon: "settings",
  },
  {
    id: "3",
    title: "Security Audit triggered",
    timestamp: "2 hours ago",
    category: "Security",
    icon: "shield",
  },
  {
    id: "4",
    title: "Monthly Report generated",
    timestamp: "5 hours ago",
    category: "Automated",
    icon: "file",
  },
  {
    id: "5",
    title: "Manager permissions granted",
    timestamp: "Yesterday",
    category: "Compliance",
    icon: "check",
  },
];

export const mockProductivityData: ProductivityDataPoint[] = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 58 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 30 },
];
