import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { AnalyticsChartsSection } from "@/components/dashboard/AnalyticsChartsSection";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

import { ProfilesPanel } from "@/components/dashboard/ProfilesPanel";
import { ReportsPanel } from "@/components/dashboard/ReportsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { useDashboardGuard } from "@/hooks/useDashboardGuard";
import { AuthModal } from "@/components/auth/AuthModal";
import { ChildrenSection } from "@/components/dashboard/ChildrenSection";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";
import { AddChildModal } from "@/components/child/AddChildModal";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const { isAllowed, showVerification } = useDashboardGuard();
  const qc = useQueryClient();

  if (!isAllowed) {
    return null;
  }

  return (
    <>
      {showVerification && <AuthModal open={true} initialMode="verify-safety" />}
      <DashboardLayout
        activeView={activeView}
        onViewChange={setActiveView}
        onAddChildClick={() => setShowAddChildModal(true)}
      >
        {({ selectedChildEmail, childProfiles, parentName }: { selectedChildEmail: string | null; childProfiles: any[]; parentName: string; parentEmail: string }) => (
          <>
            {activeView === "overview" && (
              <div className="space-y-6">
                {/* Top: analytics cards */}
                <AnalyticsCards childEmail={selectedChildEmail} />

                {/* Charts */}
                <AnalyticsChartsSection childEmail={selectedChildEmail} />

                {/* Middle: overview + activity */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <div className="xl:col-span-2">
                    <OverviewPanel
                      childEmail={selectedChildEmail}
                      childName={childProfiles.find((c) => c.email === selectedChildEmail)?.name ?? null}
                    />
                  </div>
                  <div className="xl:col-span-1 space-y-4">
                    <ActivityTable childEmail={selectedChildEmail} />
                    <ActivityFeed />
                  </div>
                </div>

                {/* Bottom: children / profiles summary */}
                <ChildrenSection />
              </div>
            )}

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
      <AddChildModal
        open={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onChildAdded={async () => {
          setShowAddChildModal(false);
          await qc.invalidateQueries({ queryKey: ["children"] });
        }}
      />
      <VoiceAssistant />
    </>
  );
}
