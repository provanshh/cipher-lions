import { User, Settings, LogOut, Bell, Shield, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [children, setChildren] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [parentName, setParentName] = useState("Loading...");
  const [parentEmail, setParentEmail] = useState("");
  const navigate=useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

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
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    localStorage.removeItem("token");
    // Redirect or further logout logic
  };

  return (
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
          {children.map((child: any,idx) => (
            
            <div key={child._id} className="flex items-center justify-between p-2 bg-[#1E1E2C] rounded hover:bg-[#252536] transition-colors group">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-cipher-purple/20 flex items-center justify-center relative group-hover:bg-cipher-purple/30 transition-colors">
                  <span className="text-xs text-white">{idx+1}</span>
                </div>
                <div>
                  <span className="text-sm">{child.name}</span>
                  <span className="text-xs text-green-400 block">{child.status}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Monitor</Button>
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
  );
};
