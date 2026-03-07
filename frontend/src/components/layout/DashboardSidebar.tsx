import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Shield,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Child {
  _id: string;
  name: string;
  email: string;
  status?: string;
}

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  children: Child[];
  selectedChildEmail: string | null;
  onSelectChild: (email: string) => void;
  parentName: string;
}

const navItems = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "protect", icon: Shield, label: "Protection" },
  { id: "profiles", icon: Users, label: "Profiles" },
  { id: "reports", icon: FileText, label: "Reports" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar({
  collapsed,
  onToggle,
  activeView,
  onViewChange,
  children: childProfiles,
  selectedChildEmail,
  onSelectChild,
  parentName,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CipherGuard</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", collapsed && "hidden")}
          onClick={onToggle}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {collapsed && (
        <div className="flex justify-center py-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Separator />

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const btn = (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return btn;
        })}
      </nav>

      {!collapsed && (
        <>
          <Separator />
          <div className="px-3 py-3">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Profiles
            </p>
            <div className="space-y-1">
              {childProfiles.map((child) => (
                <button
                  key={child._id}
                  onClick={() => onSelectChild(child.email)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    selectedChildEmail === child.email
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {child.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{child.name}</span>
                  {child.status === "online" && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
              <button
                onClick={() => navigate("/add-child")}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/30">
                  <Plus className="h-3 w-3" />
                </span>
                <span>Add child</span>
              </button>
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="p-3">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {parentName?.charAt(0)?.toUpperCase() || "P"}
              </span>
              <span className="truncate text-sm font-medium">{parentName}</span>
            </div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Log out</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="mx-auto h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
