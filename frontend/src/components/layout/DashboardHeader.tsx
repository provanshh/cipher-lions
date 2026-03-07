import { Bell, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-children";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onGenerateReport: () => void;
}

export function DashboardHeader({
  title,
  subtitle,
  isRefreshing,
  onRefresh,
  onGenerateReport,
}: DashboardHeaderProps) {
  const { data } = useNotifications();
  const items = Array.isArray(data) ? data : (data as { notifications?: any[] })?.notifications ?? [];
  const unreadCount = items.length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate hidden sm:block">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={onGenerateReport}
        >
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Report</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isRefreshing ? "Refreshing" : "Refresh"}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px]"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {items.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {items.slice(0, 10).map((item: { id?: string; text?: string; time?: string }, i: number) => (
                  <DropdownMenuItem key={item.id ?? i} className="flex flex-col items-start gap-0.5 py-2.5">
                    <span className="text-sm leading-tight">{item.text ?? "Notification"}</span>
                    {item.time && <span className="text-xs text-muted-foreground">{item.time}</span>}
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </div>
    </header>
  );
}
