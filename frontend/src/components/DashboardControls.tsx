
import { BarChart2, HardDrive, Settings, Shield, Users, Bell, FileText, Moon, Search, Info, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface DashboardControlsProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const DashboardControls = ({ activeView, setActiveView }: DashboardControlsProps) => {
  const [lastActiveTime, setLastActiveTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("0s");
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  
  const navItems = [
    { id: "overview", icon: BarChart2, label: "Overview", notification: false },
    { id: "devices", icon: HardDrive, label: "Devices", notification: true },
    { id: "protect", icon: Shield, label: "Protection", notification: false },
    { id: "profiles", icon: Users, label: "Profiles", notification: false },
    { id: "reports", icon: FileText, label: "Reports", notification: false },
    { id: "settings", icon: Settings, label: "Settings", notification: false },
  ];

  // Update elapsed time since last active
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - lastActiveTime.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      
      if (diffHour > 0) {
        setElapsedTime(`${diffHour}h ${diffMin % 60}m`);
      } else if (diffMin > 0) {
        setElapsedTime(`${diffMin}m ${diffSec % 60}s`);
      } else {
        setElapsedTime(`${diffSec}s`);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastActiveTime]);

  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    setLastActiveTime(new Date());
    
    // If there's a notification, clear it when clicking
    if (navItems.find(item => item.id === viewId)?.notification) {
      // In a real app, this would mark notifications as read
      toast({
        title: "Updated view",
        description: `Switched to ${viewId} view`,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchText}"...`,
      });
      setSearchText("");
      setShowSearch(false);
    }
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    toast({
      title: "Theme",
      description: isDarkMode ? "Light mode activated" : "Dark mode activated",
    });
  };
  
  const showNotifications = () => {
    toast({
      title: "Notifications",
      description: "Opening notification center...",
    });
    
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };
  
  const showHelp = () => {
    toast({
      title: "Help & Support",
      description: "Opening help documentation...",
    });
  };

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-white">Dashboard Controls</h3>
        <span className="text-xs text-gray-400">Active {elapsedTime} ago</span>
      </div>
      
      {showSearch && (
        <form onSubmit={handleSearch} className="mb-3 animate-fadeIn">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search dashboard..."
              className="w-full bg-[#11111D] border border-[#2A2A3C] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cipher-purple/50 focus:ring-1 focus:ring-cipher-purple/50 pl-9"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </form>
      )}
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeView === item.id 
                ? "bg-cipher-blue/20 text-white" 
                : "text-gray-400 hover:bg-[#1E1E2C] hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {activeView === item.id && (
              <span className="ml-auto h-2 w-2 rounded-full bg-cipher-blue animate-pulse"></span>
            )}
            {item.notification && activeView !== item.id && (
              <span className="ml-auto h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="mt-4 pt-4 border-t border-[#2A2A3C]">
        <div className="flex justify-between">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-[#1E1E2C] hover:bg-[#252536] text-cyan-400 transition-colors"
            title={isDarkMode ? "Toggle light mode" : "Toggle dark mode"}
          >
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          
          <button
            onClick={showNotifications}
            className="p-2 rounded-lg bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border border-[#1E1E2C] flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">{notificationCount > 9 ? '9+' : notificationCount}</span>
              </span>
            )}
          </button>
          
          <button
            onClick={showHelp}
            className="p-2 rounded-lg bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-white transition-colors"
            title="Help"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
