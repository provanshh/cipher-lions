import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Settings, Users, Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useParentProfile } from "@/hooks/use-auth";

export function SettingsPanel() {
  const navigate = useNavigate();
  const { data: parent } = useParentProfile();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Bell,
            title: "Notifications",
            items: [
              { label: "Email alerts", on: true },
              { label: "Mobile notifications", on: true },
              { label: "Weekly digest", on: false },
            ],
          },
          {
            icon: Settings,
            title: "Account",
            items: [
              { label: "Two-factor auth", on: true },
              { label: "Data backups", on: false },
              { label: "Activity logging", on: true },
            ],
          },
          {
            icon: Users,
            title: "Privacy",
            items: [
              { label: "Data anonymization", on: true },
              { label: "Auto data deletion", on: true },
              { label: "Activity insights", on: true },
            ],
          },
        ].map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <section.icon className="h-4 w-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">General Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Language",
                options: ["English (US)", "Spanish", "French", "German"],
                defaultVal: "English (US)",
              },
              {
                label: "Time Zone",
                options: ["Pacific (GMT-7)", "Mountain (GMT-6)", "Central (GMT-5)", "Eastern (GMT-4)", "GMT"],
                defaultVal: "Pacific (GMT-7)",
              },
              {
                label: "Theme",
                options: ["Dark", "Light", "System Default"],
                defaultVal: "Dark",
              },
              {
                label: "Data Retention",
                options: ["30 days", "60 days", "90 days", "1 year"],
                defaultVal: "30 days",
              },
            ].map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="text-sm text-muted-foreground">{field.label}</label>
                <Select defaultValue={field.defaultVal}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {parent && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{parent.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{parent.email}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
        <Button onClick={() => toast.success("Settings saved successfully")}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
