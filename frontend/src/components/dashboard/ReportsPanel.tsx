import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchWebUsageStatsFull, fetchAlertsFull, fetchBlockedStatsFull, fetchActivities } from "@/api/children";
import { generatePDFReport } from "@/utils/pdfGenerator";
import { useChildren } from "@/hooks/use-children";

interface ReportsPanelProps {
  childEmail?: string | null;
  parentName?: string;
}

export function ReportsPanel({ childEmail, parentName }: ReportsPanelProps) {
  const [dateRange, setDateRange] = useState("7");
  const [reportType, setReportType] = useState("all");
  const [generating, setGenerating] = useState(false);
  const { data: children = [] } = useChildren();

  const child = children.find((c) => c.email === childEmail);

  const handleGenerate = async () => {
    if (!childEmail) {
      toast.error("Please select a child profile first");
      return;
    }
    setGenerating(true);
    try {
      const timeFrame = dateRange === "7" ? "week" : dateRange === "30" ? "month" : "today";
      const [usageData, alertsData, blockedData, activityData] = await Promise.all([
        fetchWebUsageStatsFull(childEmail),
        fetchAlertsFull(childEmail),
        fetchBlockedStatsFull(childEmail),
        fetchActivities(childEmail, timeFrame),
      ]);

      await generatePDFReport(child?.name || "Unknown", childEmail, parentName || "", {
        webUsage: usageData.usageDetails || [],
        alerts: alertsData.alerts || [],
        blocked: blockedData.blockedList || [],
        totalTime: usageData.totalTime || "0m",
        activities: activityData.activities || [],
      });

      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Weekly Summary", desc: "Activity from the past 7 days", range: "week" },
          { title: "Monthly Summary", desc: "Activity from the past 30 days", range: "month" },
        ].map((report) => (
          <Card key={report.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{report.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{report.desc}</p>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={!childEmail || generating}
                  onClick={async () => {
                    if (!childEmail) return;
                    setGenerating(true);
                    try {
                      const [usageData, alertsData, blockedData, activityData] = await Promise.all([
                        fetchWebUsageStatsFull(childEmail),
                        fetchAlertsFull(childEmail),
                        fetchBlockedStatsFull(childEmail),
                        fetchActivities(childEmail, report.range),
                      ]);

                      await generatePDFReport(child?.name || "Unknown", childEmail, parentName || "", {
                        webUsage: usageData.usageDetails || [],
                        alerts: alertsData.alerts || [],
                        blocked: blockedData.blockedList || [],
                        totalTime: usageData.totalTime || "0m",
                        activities: activityData.activities || [],
                      });
                      toast.success(`${report.title} downloaded`);
                    } catch {
                      toast.error("Failed to generate report");
                    } finally {
                      setGenerating(false);
                    }
                  }}
                >
                  {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Custom Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All activity</SelectItem>
                  <SelectItem value="websites">Websites only</SelectItem>
                  <SelectItem value="search">Search history</SelectItem>
                  <SelectItem value="alerts">Alerts & blocks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={generating || !childEmail}>
              {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
