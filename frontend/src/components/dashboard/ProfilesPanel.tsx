import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Activity, Bell, Users, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfilesPanelProps {
  children: any[];
  onSelectChild: (email: string) => void;
  onSwitchToOverview: () => void;
}

export function ProfilesPanel({ children: childProfiles, onSelectChild, onSwitchToOverview }: ProfilesPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {childProfiles.length > 0 ? (
        childProfiles.map((child: any) => (
          <Card key={child._id}>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {child.name?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h4 className="font-medium">{child.name}</h4>
                    <p className="text-sm text-muted-foreground">{child.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onSelectChild(child.email);
                    onSwitchToOverview();
                    toast.success(`Viewing ${child.name}'s activity`);
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View Activity
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${child.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                    <span className={`text-sm font-medium ${child.status === "online" ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {child.status === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Extension Token</p>
                  <code className="text-xs text-primary font-mono break-all">
                    {child.extensionToken || "Pending"}
                  </code>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-6 px-5 py-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  {child.blockedUrls?.length || 0} Blocked
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  {child.monitoredUrls?.length || 0} Sites
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  {child.incognitoAlerts?.length || 0} Alerts
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-medium mb-1">No profiles yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a child profile to start monitoring their online activity
            </p>
            <Button onClick={() => navigate("/add-child")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child Profile
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <h4 className="text-sm font-medium mb-1">Add another child</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Monitor and protect all your children with CipherGuard
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate("/add-child")}>
            Add Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
