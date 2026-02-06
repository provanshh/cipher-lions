// import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardControls } from "@/components/DashboardControls";
import { SectionHeading } from "@/components/SectionHeading";
import { DashboardPreview } from "@/components/DashboardPreview";
import { UserProfile } from "@/components/UserProfile";
import { DashboardStats } from "@/components/DashboardStats";
import { DeviceList } from "@/components/DeviceList";
import { ProtectionStatus } from "@/components/ProtectionStatus";
import { ActivityMonitor } from "@/components/ActivityMonitor";
import { Button } from "@/components/Button";
import { User, LogOut, Shield, Edit, Plus, CloudLightning } from "lucide-react";
import { useEffect, useState } from "react";
// import { Button } from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  Clock as LucideClock,
  Download,
  FileText,
  RefreshCw,
  Save,
  Settings,
  Shield as LucidShield,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generatePDFReport } from "@/utils/pdfGenerator";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [children, setChildren] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [parentName, setParentName] = useState("Loading...");
  const [parentEmail, setParentEmail] = useState("");
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [selectedChildEmail, setSelectedChildEmail] = useState<string | null>(null);
  // console.log(selectedChildEmail)
  console.log(children)
  // if(children)setSelectedChildEmail(children[0]?.email)

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`
    };
    // console.log(token)

    const fetchData = async () => {
      try {
        const [parentRes, childrenRes, notificationsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKENDURL}/api/auth/user`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKENDURL}/api/parent/children`, { headers }),
          axios.get("/api/notifications", { headers })

        ]);
        // console.log(parentRes)
        console.log(childrenRes.data)

        setParentName(parentRes.data.name);
        setParentEmail(parentRes.data.email);
        setChildren(childrenRes.data);
        if (childrenRes.data && childrenRes.data.length > 0) {
          setSelectedChildEmail(childrenRes.data[0].email);
        }

        // setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
        });
      }
    };

    fetchData();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      markAllAsRead();
    }
  };

  const markAllAsRead = () => {
    if (unreadCount > 0) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast({
        title: "Notifications",
        description: "All notifications marked as read",
      });
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleProfileUpdate = () => {
    setEditMode(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };


  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing dashboard",
      description: "Getting the latest data...",
    });

    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard updated",
        description: "All data is now up to date",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <SectionHeading
              title="CipherGuard Dashboard"
              subtitle="Monitor and protect your child's online activities"
              glowColor="blue"
            />

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={async () => {
                  if (!selectedChildEmail) {
                    toast({
                      title: "Error",
                      description: "Please select a child profile first",
                      variant: "destructive",
                    });
                    return;
                  }

                  toast({
                    title: "Generating report",
                    description: "Compiling data for PDF report...",
                  });

                  try {
                    const token = localStorage.getItem("token");
                    const child = children.find((c: any) => c.email === selectedChildEmail);
                    const childName = child ? child.name : "Unknown";

                    // Fetch all necessary data
                    const [usageRes, alertsRes, blockedRes, activityRes] = await Promise.all([
                      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/web-usagefull/${selectedChildEmail}`, { headers: { Authorization: `Bearer ${token}` } }),
                      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/alertsfull/${selectedChildEmail}`, { headers: { Authorization: `Bearer ${token}` } }),
                      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/blockedfull/${selectedChildEmail}`, { headers: { Authorization: `Bearer ${token}` } }),
                      fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/web-usage-filtered`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ childEmail: selectedChildEmail, timeFrame: "today" })
                      })
                    ]);

                    const usageData = await usageRes.json();
                    const alertsData = await alertsRes.json();
                    const blockedData = await blockedRes.json();
                    const activityData = await activityRes.json();

                    await generatePDFReport(
                      childName,
                      selectedChildEmail,
                      parentName,
                      {
                        webUsage: usageData.usageDetails || [],
                        alerts: alertsData.alerts || [],
                        blocked: blockedData.blockedList || [],
                        totalTime: usageData.totalTime || "0m",
                        activities: activityData.activities || []
                      }
                    );

                    toast({
                      title: "Report Downloaded",
                      description: "Your PDF report has been generated successfully.",
                    });

                  } catch (error) {
                    console.error("Report generation error:", error);
                    toast({
                      title: "Error",
                      description: "Failed to generate report",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>

              <Button
                variant="blue"
                size="sm"
                className="flex items-center"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-[#1E1E2C] flex items-center justify-center border border-[#2A2A3C] relative group">
                      <User className="h-6 w-6 text-cipher-blue" />
                      <div className="absolute inset-0 rounded-full border border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {!editMode ? (
                      <div>
                        <h3 className="font-medium neon-blue-text">Parent Account</h3>
                        <p className="text-sm text-gray-400 flex items-center">
                          {parentName}
                          <button onClick={() => setEditMode(true)} className="ml-2 text-cyan-500 hover:text-cyan-400 transition-colors">
                            <Edit className="h-3 w-3" />
                          </button>
                        </p>
                        <p className="text-xs text-gray-500">{parentEmail}</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium neon-blue-text">Edit Profile</h3>
                        <div className="flex items-center mt-1">
                          <input
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="text-sm bg-[#1E1E2C] border border-[#2A2A3C] rounded px-2 py-1 text-white"
                          />
                          <button
                            onClick={handleProfileUpdate}
                            className="ml-2 text-xs bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 px-2 py-1 rounded transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notifications and Menu */}
                  <div className="flex items-center space-x-2">
                    {/* Bell Icon */}
                    <div className="relative">
                      <button
                        onClick={toggleNotifications}
                        className={`p-2 rounded-lg ${showNotifications ? 'bg-cipher-blue/20 text-cyan-400' : 'bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-cyan-400'} transition-colors`}
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center border border-[#11111D]">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-[#11111D] border border-[#2A2A3C] rounded-lg shadow-xl z-10 overflow-hidden animate-fade-in">
                          <div className="flex items-center justify-between p-3 border-b border-[#2A2A3C]">
                            <h4 className="text-sm font-medium text-cyan-400">Notifications</h4>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>

                          <div className="max-h-72 overflow-y-auto p-1">
                            {notifications.length > 0 ? (
                              notifications.map(notification => (
                                <div
                                  key={notification.id}
                                  className={`p-2 hover:bg-[#1E1E2C] rounded-lg mb-1 ${notification.read ? 'opacity-70' : ''}`}
                                >
                                  <div className="flex justify-between items-start">
                                    <p className={`text-xs ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                      {notification.text}
                                    </p>
                                    <button
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-gray-500 hover:text-red-400 ml-2"
                                    >
                                      <span className="text-xs">×</span>
                                    </button>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                                </div>
                              ))
                            ) : (
                              <div className="py-4 text-center text-gray-500 text-sm">
                                No notifications
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Settings Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 rounded-lg ${showMenu ? 'bg-cipher-blue/20 text-cyan-400' : 'bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-cyan-400'} transition-colors`}
                      >
                        <Settings className="h-5 w-5" />
                      </button>

                      {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#11111D] border border-[#2A2A3C] rounded-lg shadow-xl z-10 overflow-hidden animate-fade-in">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-[#1E1E2C] hover:text-white transition-colors flex items-center"
                            onClick={() => {
                              setShowMenu(false);
                              toast({ title: "Account settings", description: "Opening account settings..." });
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" /> Account settings
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-[#1E1E2C] hover:text-white transition-colors flex items-center"
                            onClick={() => {
                              setShowMenu(false);
                              toast({ title: "Security", description: "Opening security settings..." });
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" /> Security
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center border-t border-[#2A2A3C]"
                            onClick={() => {
                              setShowMenu(false);
                              handleLogout();
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" /> Log out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Children/Monitored Profiles */}
                <div className="mt-4 pt-4 border-t border-[#2A2A3C]">
                  <h4 className="text-sm font-medium mb-2">Monitored Profiles</h4>
                  <div className="space-y-2">
                    {children.map((child: any, idx) => (

                      <div key={child._id} className="flex items-center justify-between p-2 bg-[#1E1E2C] rounded hover:bg-[#252536] transition-colors group">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-cipher-purple/20 flex items-center justify-center relative group-hover:bg-cipher-purple/30 transition-colors">
                            <span className="text-xs text-white">{idx + 1}</span>
                          </div>
                          <div >
                            <span className={"text-sm " + (selectedChildEmail === child.email ? "text-blue-400 font-bold" : "")}>
                              {child.name}
                            </span>
                            <span className="text-xs text-green-400 block">{child.status}</span>
                          </div>
                        </div>
                        <Button onClick={() => (setSelectedChildEmail(child.email))} variant="outline" size="sm" className="text-xs py-1 px-2">Monitor</Button>
                      </div>
                    ))}

                    <button
                      className="w-full flex items-center justify-center space-x-1 py-2 mt-2 bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-white rounded transition-colors text-sm"
                      onClick={() => {
                        navigate("../add-child")

                      }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add profile</span>
                    </button>
                  </div>
                </div>
              </div>
              <DashboardControls activeView={activeView} setActiveView={setActiveView} />
              <ProtectionStatus isActive={true} />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {activeView === "overview" && (
                <>
                  <DashboardStats childEmail={selectedChildEmail} />
                  <DashboardPreview childEmail={selectedChildEmail} />
                  <ActivityMonitor childEmail={selectedChildEmail} />
                </>
              )}
              {/*               
              // {activeView === "devices" && (
              //   <DeviceList />
              // )} */}

              {activeView === "protect" && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-6 neon-blue-text">Protection Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 text-cyan-400 flex items-center">
                        <LucidShield className="h-4 w-4 mr-2" />
                        Content Filtering
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Block adult content</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Block violence</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Filter profanity</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 text-cyan-400 flex items-center">
                        <LucideClock className="h-4 w-4 mr-2" />
                        Time Restrictions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">School hours blocking</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bedtime restrictions</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekend limits</span>
                          <div className="h-6 w-11 bg-[#1E1E2C] rounded-full relative">
                            <div className="h-5 w-5 bg-gray-500 rounded-full absolute top-0.5 left-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C] mb-6">
                    <h4 className="font-medium mb-3 text-cyan-400">AI Protection Levels</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Image Analysis</span>
                          <span className="text-xs text-cyan-400">High</span>
                        </div>
                        <div className="w-full bg-[#1E1E2C] rounded-full h-2">
                          <div className="bg-cipher-blue h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Text Analysis</span>
                          <span className="text-xs text-cyan-400">Medium</span>
                        </div>
                        <div className="w-full bg-[#1E1E2C] rounded-full h-2">
                          <div className="bg-cipher-blue h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Behavioral Analysis</span>
                          <span className="text-xs text-cyan-400">Low</span>
                        </div>
                        <div className="w-full bg-[#1E1E2C] rounded-full h-2">
                          <div className="bg-cipher-blue h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Reset settings",
                          description: "Are you sure you want to reset all protection settings?",
                        });
                      }}
                    >
                      Reset to Default
                    </Button>
                    <Button
                      variant="blue"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Settings saved",
                          description: "Your protection settings have been updated",
                        });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              )}

              {activeView === "profiles" && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-6 neon-blue-text">Profile Management</h3>

                  <div className="space-y-6">
                    {children.length > 0 ? (
                      children.map((child: any) => (
                        <div key={child._id} className="bg-[#11111D] rounded-lg border border-[#2A2A3C]">
                          <div className="p-4 border-b border-[#2A2A3C]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-cipher-purple/20 flex items-center justify-center">
                                  <span className="text-lg text-white font-bold">{child.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">{child.name}</h4>
                                  <span className="text-sm text-gray-400">{child.email}</span>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="blue"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedChildEmail(child.email);
                                    setActiveView("overview");
                                    toast({
                                      title: "Profile selected",
                                      description: `Viewing ${child.name}'s dashboard activity`,
                                    });
                                  }}
                                >
                                  View Activity
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#2A2A3C]">
                            <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#2A2A3C]">
                              <h5 className="text-sm font-medium text-gray-400 mb-1">Status</h5>
                              <span className="text-green-400 flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                Active & Protected
                              </span>
                            </div>
                            <div className="p-4">
                              <h5 className="text-sm font-medium text-gray-400 mb-1">Security Tokens</h5>
                              <span className="text-cipher-blue font-mono text-xs">{child.extensionToken || "Pending Activation"}</span>
                            </div>
                          </div>

                          <div className="p-4">
                            <h5 className="text-sm font-medium text-gray-400 mb-2">Activities Recorded</h5>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <LucidShield className="h-4 w-4 text-cipher-purple mr-1" />
                                <span className="text-xs text-white">{child.blockedUrls?.length || 0} Blocked</span>
                              </div>
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 text-cipher-blue mr-1" />
                                <span className="text-xs text-white">{child.monitoredUrls?.length || 0} Sites Monitored</span>
                              </div>
                              <div className="flex items-center">
                                <Bell className="h-4 w-4 text-red-400 mr-1" />
                                <span className="text-xs text-white">{child.incognitoAlerts?.length || 0} Alerts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#11111D] p-12 rounded-lg border border-dashed border-[#2A2A3C] text-center">
                        <Users className="h-12 w-12 text-gray-600 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">No pulse profiles found. Please add a profile to start monitoring.</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-[#2A2A3C]">
                      <h4 className="font-medium">Add New Profile</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-cyan-400 border-cyan-500/30"
                        onClick={() => {
                          toast({
                            title: "Create profile",
                            description: "Opening profile creation wizard...",
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Profile
                      </Button>
                    </div>

                    <div className="bg-[#11111D] rounded-lg border border-[#2A2A3C] border-dashed p-6 flex flex-col items-center justify-center text-center">
                      <Users className="h-12 w-12 text-gray-500 mb-2" />
                      <h5 className="font-medium text-gray-400 mb-1">Add another child profile</h5>
                      <p className="text-sm text-gray-500 mb-4">Monitor and protect all your children with CipherGuard</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Create profile",
                            description: "Opening profile creation wizard...",
                          });
                        }}
                      >
                        Create New Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeView === "reports" && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-6 neon-blue-text">Activity Reports</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 text-cyan-400">Weekly Summary</h4>
                      <p className="text-sm text-gray-400 mb-4">Overview of activities from the past 7 days</p>
                      <div className="h-36 bg-[#1E1E2C] rounded-lg flex items-center justify-center">
                        <Activity className="h-8 w-8 text-cipher-purple opacity-80" />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 text-cyan-400">Monthly Analysis</h4>
                      <p className="text-sm text-gray-400 mb-4">Detailed analysis of online behavior patterns</p>
                      <div className="h-36 bg-[#1E1E2C] rounded-lg flex items-center justify-center">
                        <Activity className="h-8 w-8 text-cipher-blue opacity-80" />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#11111D] rounded-lg border border-[#2A2A3C] mb-6">
                    <div className="p-4 border-b border-[#2A2A3C]">
                      <h4 className="font-medium text-cyan-400">Custom Reports</h4>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Date Range</label>
                          <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Custom range</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Report Type</label>
                          <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                            <option>All activity</option>
                            <option>Websites only</option>
                            <option>Search history</option>
                            <option>Apps usage</option>
                            <option>Alerts & blocks</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Format</label>
                          <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                            <option>PDF Report</option>
                            <option>CSV Export</option>
                            <option>Excel Spreadsheet</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="blue"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Generating report",
                              description: "Your custom report is being generated...",
                            });

                            setTimeout(() => {
                              toast({
                                title: "Report ready",
                                description: "Your custom report is ready to download",
                              });
                            }, 2000);
                          }}
                        >
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#11111D] rounded-lg border border-[#2A2A3C]">
                    <div className="p-4 border-b border-[#2A2A3C]">
                      <h4 className="font-medium text-cyan-400">Previous Reports</h4>
                    </div>

                    <div className="p-2">
                      <div className="flex justify-between items-center p-2 hover:bg-[#1E1E2C] rounded transition-colors">
                        <span className="text-sm">Weekly Report - Apr 10, 2025</span>
                        <Button variant="outline" size="sm" className="text-xs h-8">Download</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-[#1E1E2C] rounded transition-colors">
                        <span className="text-sm">Monthly Report - March 2025</span>
                        <Button variant="outline" size="sm" className="text-xs h-8">Download</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-[#1E1E2C] rounded transition-colors">
                        <span className="text-sm">Custom Report - Feb 15-28, 2025</span>
                        <Button variant="outline" size="sm" className="text-xs h-8">Download</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === "settings" && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-6 neon-blue-text">Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 flex items-center text-cyan-400">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Email alerts</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mobile notifications</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekly digest</span>
                          <div className="h-6 w-11 bg-[#1E1E2C] rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-gray-500 rounded-full absolute top-0.5 left-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 flex items-center text-cyan-400">
                        <Settings className="h-4 w-4 mr-2" />
                        Account
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Two-factor auth</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Data backups</span>
                          <div className="h-6 w-11 bg-[#1E1E2C] rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-gray-500 rounded-full absolute top-0.5 left-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Activity logging</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C]">
                      <h4 className="font-medium mb-3 flex items-center text-cyan-400">
                        <Users className="h-4 w-4 mr-2" />
                        Privacy
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Data anonymization</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Auto data deletion</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Activity insights</span>
                          <div className="h-6 w-11 bg-green-900/30 rounded-full relative cursor-pointer">
                            <div className="h-5 w-5 bg-green-500 rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#11111D] p-4 rounded-lg border border-[#2A2A3C] mb-6">
                    <h4 className="font-medium mb-3 text-cyan-400">General Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Language</label>
                        <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Chinese (Simplified)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Time Zone</label>
                        <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                          <option>Pacific Time (GMT-7)</option>
                          <option>Mountain Time (GMT-6)</option>
                          <option>Central Time (GMT-5)</option>
                          <option>Eastern Time (GMT-4)</option>
                          <option>GMT</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Theme</label>
                        <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                          <option>Dark (Cybersecurity)</option>
                          <option>Light</option>
                          <option>System Default</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Data Retention</label>
                        <select className="w-full p-2 bg-[#1E1E2C] rounded-lg border border-[#2A2A3C] text-white text-sm">
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Warning",
                            description: "This will delete all your data. Are you sure?",
                            variant: "destructive"
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Export data",
                            description: "Preparing your data for export...",
                          });
                        }}
                      >
                        Export Data
                      </Button>
                    </div>

                    <Button
                      variant="blue"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Settings saved",
                          description: "Your settings have been updated successfully",
                        });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
