import { Activity, Calendar, Clock, Search, AlertTriangle, ExternalLink, ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const ActivityMonitor = ({ childEmail }) => {
  const [timeFrame, setTimeFrame] = useState("today");
  const [activities, setActivities] = useState([]);
  console.log(childEmail)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "search": return Search;
      case "website": return ExternalLink;
      case "app": return Activity;
      case "alert": return AlertTriangle;
      case "download": return ArrowDownCircle;
      default: return Activity;
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/web-usage-filtered`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ childEmail, timeFrame }),
      });

      const data = await res.json();
      console.log(data);
      setActivities(data.activities || []);

    } catch (err) {
      console.error("Error fetching activities:", err);
      toast({ title: "Error", description: "Could not load activity data." });
    }
  };



  useEffect(() => {
    fetchActivities();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchActivities();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [timeFrame, childEmail]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-6 neon-blue-text">Activity Monitor</h3>

      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="p-2 bg-[#11111D] rounded-lg border border-[#2A2A3C] text-white text-sm"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>

        <button
          onClick={() =>
            toast({ title: "Export", description: "PDF Export not implemented yet." })
          }
          className="text-xs bg-[#1E1E2C] text-cyan-400 px-3 py-1.5 rounded"
        >
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Export
        </button>
      </div>

      <div className="bg-[#11111D] rounded-lg border border-[#2A2A3C] overflow-hidden">
        <div className="grid grid-cols-10 p-3 border-b border-[#2A2A3C] bg-[#1E1E2C] text-xs font-medium text-gray-400">
          <div className="col-span-7">Activity</div>
          <div className="col-span-3">Time</div>
          {/* <div className="col-span-2">Status</div> */}
        </div>

        <div className="max-h-[380px] overflow-y-auto">
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type || "search");
              return (
                <div key={index} className="grid grid-cols-10 p-3 border-b border-[#2A2A3C] last:border-0">
                  <div className="col-span-7 flex items-center">
                    <div className="h-8 w-8 rounded bg-cyan-900/20 text-cyan-400 flex items-center justify-center mr-3">
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm truncate">{activity.content}</span>
                  </div>
                  <div className="col-span-3 flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {/* <div className="col-span-2">{getStatusBadge(activity.status)}</div> */}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400">No activities found</div>
          )}
        </div>
      </div>
    </div>
  );
};
