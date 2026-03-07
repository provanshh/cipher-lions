import { AlertTriangle, Clock, Eye, Globe, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebUsageStats, useAlerts, useBlockedStats, useWebUsageStatsFull } from "@/hooks/use-children";

interface AnalyticsCardsProps {
  childEmail: string | null;
}

export function AnalyticsCards({ childEmail }: AnalyticsCardsProps) {
  const { data: usage, isLoading: usageLoading } = useWebUsageStats(childEmail);
  const { data: usageFull } = useWebUsageStatsFull(childEmail);
  const { data: alertsData, isLoading: alertsLoading } = useAlerts(childEmail);
  const { data: blocked, isLoading: blockedLoading } = useBlockedStats(childEmail);

  const sitesVisited = usageFull?.usageDetails?.length ?? 0;
  const searchCount = usageFull?.usageDetails?.reduce((acc, u) => acc + (u.searchQueries?.length ?? 0), 0) ?? 0;

  const stats = [
    {
      icon: Clock,
      label: "Screen Time",
      value: usage?.totalTime ?? "0m",
      loading: usageLoading,
      accent: "primary",
    },
    {
      icon: Globe,
      label: "Sites Visited",
      value: String(sitesVisited),
      loading: usageLoading,
      accent: "blue",
    },
    {
      icon: Shield,
      label: "Searches",
      value: String(searchCount),
      loading: usageLoading,
      accent: "emerald",
    },
    {
      icon: AlertTriangle,
      label: "Alerts",
      value: String(alertsData?.alerts?.length ?? 0),
      loading: alertsLoading,
      accent: "amber",
    },
    {
      icon: Eye,
      label: "Blocked",
      value: String(blocked?.count ?? 0),
      loading: blockedLoading,
      accent: "rose",
    },
  ];

  const accentClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden transition-colors hover:border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses[stat.accent]}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            {stat.loading ? (
              <Skeleton className="h-9 w-16 mt-1.5" />
            ) : (
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
