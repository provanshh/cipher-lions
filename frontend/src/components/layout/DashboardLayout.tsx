import { useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "@/lib/utils";
import { useParentProfile } from "@/hooks/use-auth";
import { useChildren } from "@/hooks/use-children";
import { fetchWebUsageStatsFull, fetchAlertsFull, fetchBlockedStatsFull, fetchActivities } from "@/api/children";
import { generatePDFReport } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RenderProps {
  selectedChildEmail: string | null;
  childProfiles: any[];
  parentName: string;
  parentEmail: string;
}

interface DashboardLayoutProps {
  activeView: string;
  onViewChange: (view: string) => void;
  children: ((props: RenderProps) => ReactNode) | ReactNode;
}

export function DashboardLayout({ activeView, onViewChange, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedChildEmail, setSelectedChildEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: parent } = useParentProfile();
  const { data: childProfiles = [] } = useChildren();

  const parentName = parent?.name ?? "Loading...";
  const parentEmail = parent?.email ?? "";

  if (childProfiles.length > 0 && !selectedChildEmail) {
    setSelectedChildEmail(childProfiles[0].email);
  }

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    qc.invalidateQueries().then(() => {
      setIsRefreshing(false);
      toast.success("Dashboard updated");
    });
  }, [qc]);

  const handleGenerateReport = useCallback(async () => {
    if (!selectedChildEmail) {
      toast.error("Please select a child profile first");
      return;
    }

    toast.info("Generating report...");

    try {
      const child = childProfiles.find((c: any) => c.email === selectedChildEmail);
      const childName = child?.name || "Unknown";

      const [usageData, alertsData, blockedData, activityData] = await Promise.all([
        fetchWebUsageStatsFull(selectedChildEmail),
        fetchAlertsFull(selectedChildEmail),
        fetchBlockedStatsFull(selectedChildEmail),
        fetchActivities(selectedChildEmail, "today"),
      ]);

      await generatePDFReport(childName, selectedChildEmail, parentName, {
        webUsage: usageData.usageDetails || [],
        alerts: alertsData.alerts || [],
        blocked: blockedData.blockedList || [],
        totalTime: usageData.totalTime || "0m",
        activities: activityData.activities || [],
      });

      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to generate report");
    }
  }, [selectedChildEmail, childProfiles, parentName]);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Overview", subtitle: "Monitor your child's online activity" },
    protect: { title: "Protection", subtitle: "Configure content filtering and restrictions" },
    profiles: { title: "Profiles", subtitle: "Manage monitored child profiles" },
    reports: { title: "Reports", subtitle: "View and export activity reports" },
    settings: { title: "Settings", subtitle: "Configure your account preferences" },
  };

  const current = viewTitles[activeView] || viewTitles.overview;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeView={activeView}
        onViewChange={onViewChange}
        children={childProfiles}
        selectedChildEmail={selectedChildEmail}
        onSelectChild={setSelectedChildEmail}
        parentName={parentName}
      />

      <div className={cn("transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <DashboardHeader
          title={current.title}
          subtitle={current.subtitle}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onGenerateReport={handleGenerateReport}
          unreadCount={0}
        />

        <main className="p-6">
          {typeof children === "function"
            ? children({ selectedChildEmail, childProfiles, parentName, parentEmail })
            : children}
        </main>
      </div>
    </div>
  );
}
