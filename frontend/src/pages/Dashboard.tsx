import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { ProtectionPanel } from "@/components/dashboard/ProtectionPanel";
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
                <StatsCards childEmail={selectedChildEmail} />
                <OverviewPanel
                  childEmail={selectedChildEmail}
                  childName={childProfiles.find((c) => c.email === selectedChildEmail)?.name ?? null}
                />
                <ActivityTable childEmail={selectedChildEmail} />
                <ChildrenSection />
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
