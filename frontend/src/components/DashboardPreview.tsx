import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lock,
  Shield,
  Clock,
  Activity,
  Search,
  Users,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
// import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

const getLast6Days = () => {
  const today = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  });
};

const RealtimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const days = getLast6Days();
    const randomData = days.map((day) => ({
      day,
      screenTime: Math.floor(Math.random() * (180 - 50 + 1)) + 50,
    }));
    setData(randomData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="screenTime" stroke="#8b5cf6" dot={true} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealtimeChart;


export const DashboardPreview = ({ childEmail }) => {
  const [activeTab, setActiveTab] = useState("parent");
  const [screenTime, setScreenTime] = useState(204); // in minutes
  const [dailyLimit, setDailyLimit] = useState(300); // in minutes
  const [percentUsed, setPercentUsed] = useState(68);
  const [recentSearches, setRecentSearches] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertsHandled, setAlertsHandled] = useState(false);
  const [blockWebsite, setBlockWebsite] = useState("");
  const [blockedWebsites, setBlockedWebsites] = useState([]);
  const [websiteCategories, setWebsiteCategories] = useState([]);

  useEffect(() => {
    // Calculate percentage used
    const newPercent = Math.floor((screenTime / dailyLimit) * 100);
    setPercentUsed(newPercent);
  }, [screenTime, dailyLimit]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch alerts
        const alertsRes = await fetch(
          `${import.meta.env.VITE_BACKENDURL}/api/child/alertsfull/${childEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (alertsRes) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData.alerts || []);
        }

        // Fetch web usage
        const usageRes = await fetch(
          `${import.meta.env.VITE_BACKENDURL}/api/child/web-usagefull/${childEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (usageRes) {
          const usageData = await usageRes.json();
          const sortedUsage = usageData.usageDetails
            .filter(item => item.lastUpdated) // Ensure valid timestamps
            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

          console.log(sortedUsage)
          setRecentSearches(sortedUsage.slice(0, 5));
          const categoryMap = {};
          usageData.usageDetails.forEach(item => {
            const category = item.category || "general";
            categoryMap[category] = (categoryMap[category] || 0) + 1;
          });

          const categories = Object.entries(categoryMap).map(([category, count]) => ({
            category,
            count,
          }));

          setWebsiteCategories(categories);


        }

        // Fetch blocked websites
        const blockedRes = await fetch(
          `${import.meta.env.VITE_BACKENDURL}/api/child/blockedfull/${childEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (blockedRes) {
          const blockedData = await blockedRes.json();
          setBlockedWebsites(blockedData.blockedList || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  }, [childEmail, blockWebsite]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleAddTime = () => {
    if (screenTime < dailyLimit) {
      setScreenTime((prev) => prev + 30);
      toast({
        title: "Screen time added",
        description: "Added 30 minutes of screen time",
      });
    }
  };

  const handleReduceTime = () => {
    if (screenTime >= 30) {
      setScreenTime((prev) => prev - 30);
      toast({
        title: "Screen time reduced",
        description: "Reduced screen time by 30 minutes",
      });
    }
  };

  function normalizeDomain(url) {
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  }

  const handleBlockWebsite = async (e) => {
    e.preventDefault();
    if (!blockWebsite.trim()) return;

    const normalizedDomain = normalizeDomain(blockWebsite);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/parent/children/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: normalizedDomain, email: childEmail }),
        }
      );

      if (res.ok) {
        toast({
          title: "Website blocked",
          description: `${normalizedDomain} has been added to blocked sites`,
        });
        // console.log()
        console.log(blockedWebsites)
        // setBlockedWebsites(res.bl);
        setBlockWebsite("");
      } else {
        toast({
          title: "Error",
          description: "Failed to block website",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error blocking website:", err);
    }
  };

  const handleDismissAlerts = async () => {
    try {
      console.log(`${import.meta.env.VITE_BACKENDURL}/api/child/delete-alerts/${childEmail}`)
      await fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/delete-alerts/${childEmail}`, {
        method: "DELETE",
      });

      setAlertsHandled(true);
      toast({
        title: "Alerts handled",
        description: "All alerts have been dismissed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss alerts",
      });
      console.error("Dismiss alerts error:", error);
    }
  };


  const handleClearSearches = () => {
    setRecentSearches([]);
    toast({
      title: "Search history cleared",
      description: "Recent searches have been cleared",
    });
  };
  const getColorForCategory = (category) => {
    const colorMap = {
      Social: "#F87171", // red
      Education: "#60A5FA", // blue
      Entertainment: "#FBBF24", // yellow
      News: "#34D399", // green
      Productivity: "#A78BFA", // purple
      general: "#F472B6", // pink
    };

    return colorMap[category] || "#E5E7EB"; // default light gray
  };


  return (
    <div className="bg-[#171723] rounded-xl shadow-lg border border-[#2A2A3C] overflow-hidden relative">
      <div className="scanline"></div>

      <Tabs defaultValue="parent" onValueChange={setActiveTab}>
        <div className="bg-[#11111D] px-4 py-3 border-b border-[#2A2A3C]">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#1E1E2C]">
            <TabsTrigger
              value="parent"
              className={
                activeTab === "parent"
                  ? "text-cipher-purple data-[state=active]:bg-[#252536] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  : ""
              }
            >
              Parent Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="child"
              className={
                activeTab === "child"
                  ? "text-cipher-blue data-[state=active]:bg-[#252536] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(30,174,219,0.5)]"
                  : ""
              }
            >
              Child View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="parent" className="p-0">
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activity Overview */}
            <div className="dashboard-card col-span-3 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white neon-text">
                  Activity Overview
                </h3>
                <span className="text-xs text-cyan-400">Today</span>
              </div>
              {/* <div className="h-40 bg-[#11111D] rounded-lg flex items-center justify-center">
                <Activity className="h-8 w-8 text-cipher-purple opacity-80" />
              </div> */}
              {childEmail && <div className="h-40 bg-[#11111D] rounded-lg p-2">
                <RealtimeChart />
              </div>}

            </div>

            {/* Alerts */}
            <div className="dashboard-card col-span-3 md:col-span-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white neon-text">Incognito Alerts</h3>
                {!alertsHandled && alerts.length > 0 && (
                  <button
                    onClick={handleDismissAlerts}
                    className="text-xs bg-[#11111D] text-cyan-400 px-2 py-1 rounded hover:bg-[#1E1E2C] transition-colors"
                  >
                    Delete All
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {!alertsHandled && alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="bg-[#2D1A1A] text-red-400 p-3 rounded-lg text-sm flex items-start border border-red-900/50"
                    >
                      <Bell className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{<span>{new Date(alert.timestamp).toLocaleString()}</span>
                      }</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#11111D] p-4 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-400 text-sm">
                      All alerts handled
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="dashboard-card col-span-3 md:col-span-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white neon-text">
                  Recent Searches
                </h3>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearSearches}
                    className="text-xs bg-[#11111D] text-cyan-400 px-2 py-1 rounded hover:bg-[#1E1E2C] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-[#11111D] rounded-lg border border-[#2A2A3C]/50"
                    >
                      <Search className="h-4 w-4 text-cyan-400 mr-2" />
                      <span className="text-sm text-white truncate">{search.domain}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#11111D] p-4 rounded-lg text-sm text-cyan-400 text-center">
                    No recent searches
                  </div>
                )}
              </div>
            </div>

            {/* Website Categories */}
            <div className="dashboard-card col-span-3 md:col-span-1">
              <h3 className="font-semibold text-white neon-text mb-3">
                Website Categories
              </h3>
              <ul className="text-sm text-white space-y-2">
                {websiteCategories.length > 0 ? (
                  websiteCategories.map((cat, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-[#11111D] px-3 py-2 rounded-lg border border-[#2A2A3C]/50"
                    >
                      <span className="text-white">{cat.category}</span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full`}
                        style={{
                          backgroundColor: getColorForCategory(cat.category),
                          color: "#000",
                        }}
                      >
                        {cat.count}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-cyan-400 text-sm text-center">
                    No categories found
                  </li>
                )}
              </ul>
            </div>


            {/* Screen Time Management */}
            {/* <div className="dashboard-card col-span-3 md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white neon-text">
                  Screen Time Management
                </h3>
                <span className="text-xs text-cyan-400">
                  {formatTime(screenTime)} / {formatTime(dailyLimit)}
                </span>
              </div>
              <div className="bg-[#11111D] p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <div className="w-full mx-4 bg-[#2A2A3C] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-white">{percentUsed}%</span>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={handleReduceTime}
                    className="text-xs bg-[#1E1E2C] text-white px-3 py-1 rounded hover:bg-[#2A2A3C]"
                  >
                    - 30 min
                  </button>
                  <button
                    onClick={handleAddTime}
                    className="text-xs bg-[#1E1E2C] text-white px-3 py-1 rounded hover:bg-[#2A2A3C]"
                  >
                    + 30 min
                  </button>
                </div>
              </div>
            </div> */}

            {/* Block Website */}
            <div className="dashboard-card w-full col-span-3 md:col-span-1">
              <h3 className="font-semibold text-white neon-text mb-3">
                Block Website
              </h3>
              <form onSubmit={handleBlockWebsite} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter domain"
                  value={blockWebsite}
                  onChange={(e) => setBlockWebsite(e.target.value)}
                  className="flex-grow px-1 py-2 bg-[#11111D] text-white rounded border border-[#2A2A3C]/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-xs bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700"
                >
                  Block
                </button>
              </form>
              {blockedWebsites.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-white">
                  {blockedWebsites.map((site, i) => (
                    <li
                      key={i}
                      className="bg-[#11111D] px-3 py-2 rounded-lg border border-[#2A2A3C]/50"
                    >
                      <XCircle className="inline h-4 w-4 text-red-500 mr-2" />
                      {site.domain}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Child View - Detailed Search & Activity View */}
        <TabsContent value="child" className="p-0">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white neon-text mb-2">
                Detailed Activity & Search History
              </h2>
              <p className="text-sm text-gray-400">
                Complete view of all searches and browsing activity
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* All Search Queries Section */}
              <div className="dashboard-card col-span-1 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white neon-text flex items-center">
                    <Search className="h-5 w-5 mr-2 text-cyan-400" />
                    All Search Queries
                  </h3>
                  <span className="text-xs text-cyan-400">
                    {recentSearches.length} total searches
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]/50 hover:border-cyan-400/50 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Search className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                              <span className="text-white font-medium">
                                {search.query || search.domain}
                              </span>
                            </div>
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center text-xs text-gray-400">
                                <span className="font-mono bg-[#1E1E2C] px-2 py-1 rounded">
                                  {search.domain}
                                </span>
                              </div>
                              {search.timestamp && (
                                <div className="text-xs text-gray-500">
                                  {new Date(search.timestamp).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className="text-xs bg-cipher-purple/20 text-cipher-purple px-2 py-1 rounded-full">
                              Search
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#11111D] p-8 rounded-lg text-center">
                      <Search className="h-12 w-12 text-gray-600 mx-auto mb-3 opacity-50" />
                      <p className="text-gray-400">No search queries recorded yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Website Visit History */}
              <div className="dashboard-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white neon-text flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-cyan-400" />
                    Website Visits
                  </h3>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {websiteCategories.length > 0 ? (
                    websiteCategories.map((cat, idx) => (
                      <div
                        key={idx}
                        className="bg-[#11111D] p-3 rounded-lg border border-[#2A2A3C]/50"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center flex-1">
                            <div
                              className="h-2 w-2 rounded-full mr-3"
                              style={{ backgroundColor: getColorForCategory(cat.category) }}
                            />
                            <span className="text-white text-sm">{cat.category}</span>
                          </div>
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: getColorForCategory(cat.category),
                              color: "#000",
                            }}
                          >
                            {cat.count} visits
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#11111D] p-6 rounded-lg text-center">
                      <Activity className="h-10 w-10 text-gray-600 mx-auto mb-2 opacity-50" />
                      <p className="text-gray-400 text-sm">No website visits recorded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="dashboard-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white neon-text flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                    Recent Activity Timeline
                  </h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {recentSearches.slice(0, 10).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 bg-[#11111D] p-3 rounded-lg border border-[#2A2A3C]/50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {activity.query || activity.domain}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp
                            ? new Date(activity.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentSearches.length === 0 && (
                    <div className="bg-[#11111D] p-6 rounded-lg text-center">
                      <Clock className="h-10 w-10 text-gray-600 mx-auto mb-2 opacity-50" />
                      <p className="text-gray-400 text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Alerts Summary in Child View */}
              <div className="dashboard-card col-span-1 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white neon-text flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-red-400" />
                    Security Alerts
                  </h3>
                  {alerts.length > 0 && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                      {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="bg-[#2D1A1A] p-4 rounded-lg border border-red-900/50"
                      >
                        <div className="flex items-start">
                          <Bell className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-red-400 font-medium text-sm mb-1">
                              Incognito Mode Detected
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(alert.timestamp).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-[#11111D] p-6 rounded-lg text-center">
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                      <p className="text-green-400 text-sm">No security alerts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};



