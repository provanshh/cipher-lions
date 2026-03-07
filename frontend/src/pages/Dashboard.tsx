import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { ProtectionPanel } from "@/components/dashboard/ProtectionPanel";
import { ProfilesPanel } from "@/components/dashboard/ProfilesPanel";
import { ReportsPanel } from "@/components/dashboard/ReportsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("overview");

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {({ selectedChildEmail, childProfiles, parentName }: { selectedChildEmail: string | null; childProfiles: any[]; parentName: string; parentEmail: string }) => (
        <>
          {activeView === "overview" && (
            <div className="space-y-6">
              <StatsCards childEmail={selectedChildEmail} />
              <OverviewPanel childEmail={selectedChildEmail} />
              <ActivityTable childEmail={selectedChildEmail} />
            </div>
          )}

          {activeView === "protect" && <ProtectionPanel />}

          {activeView === "profiles" && (
            <ProfilesPanel
              children={childProfiles}
              onSelectChild={() => {}}
              onSwitchToOverview={() => setActiveView("overview")}
            />
          )}

          {activeView === "reports" && (
            <ReportsPanel childEmail={selectedChildEmail} parentName={parentName} />
          )}

          {activeView === "settings" && <SettingsPanel />}
        </>
      )}
    </DashboardLayout>
  );
}
