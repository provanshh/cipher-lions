import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Clock, Eye } from "lucide-react";

interface DashboardStatsProps {
  childEmail: string | null;
}

export const DashboardStats = ({ childEmail }: DashboardStatsProps) => {
  const [webTime, setWebTime] = useState("0m");
  const [alerts, setAlerts] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [sessions, setSessions] = useState(1); // Placeholder

  useEffect(() => {
    if (!childEmail) return;

    const fetchStats = () => {
      // Fetch web usage (total time today)
      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/web-usage/${childEmail}`)
        .then((res) => res.json())
        .then((data) => setWebTime(data.totalTime || "0m"))
        .catch(console.error);

      // Fetch alerts
      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/alerts/${childEmail}`)
        .then((res) => res.json())
        .then((data) => setAlerts(data.alerts?.length || 0))
        .catch(console.error);

      // Fetch blocked content count
      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/blocked/${childEmail}`)
        .then((res) => res.json())
        .then((data) => setBlocked(data.count || 0))
        .catch(console.error);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [childEmail]);

  const stats = [
    {
      icon: Clock,
      label: "Screen Time",
      value: webTime,
      change: "+14%",
      changeType: "negative",
    },
    {
      icon: AlertTriangle,
      label: "Alerts",
      value: alerts.toString(),
      change: "-20%",
      changeType: "positive",
    },
    {
      icon: Eye,
      label: "Blocked Content",
      value: blocked.toString(),
      change: "-12%",
      changeType: "positive",
    },
    {
      icon: Activity,
      label: "Active Sessions",
      value: sessions.toString(),
      change: "No change",
      changeType: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-4 hover:shadow-[0_0_15px_rgba(30,174,219,0.3)] transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-[#1E1E2C] p-2 rounded">
              <stat.icon className="h-5 w-5 text-cipher-blue" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${stat.changeType === 'positive' ? 'bg-green-900/20 text-green-400' :
                stat.changeType === 'negative' ? 'bg-red-900/20 text-red-400' :
                  'bg-gray-900/20 text-gray-400'
              }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-400">{stat.label}</p>
          <p className="text-2xl font-bold neon-blue-text mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
