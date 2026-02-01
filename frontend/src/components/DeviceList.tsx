
import { Laptop, Smartphone, Tablet, PowerOff, Lock, RefreshCw, Plus, Shield, AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./Button";

export const DeviceList = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Emma's Laptop",
      type: "laptop",
      lastActive: "Active now",
      status: "online",
      isLocked: false,
      batteryLevel: 85,
      riskLevel: "low",
      osVersion: "Windows 11",
      lastUpdate: "2 mins ago"
    },
    {
      id: 2,
      name: "Emma's Phone",
      type: "phone",
      lastActive: "2 hours ago",
      status: "offline",
      isLocked: false,
      batteryLevel: 42,
      riskLevel: "medium",
      osVersion: "iOS 16.4",
      lastUpdate: "3 hours ago"
    },
    {
      id: 3,
      name: "Family Tablet",
      type: "tablet",
      lastActive: "Yesterday",
      status: "offline",
      isLocked: true,
      batteryLevel: 23,
      riskLevel: "high",
      osVersion: "Android 13",
      lastUpdate: "1 day ago"
    },
  ]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("laptop");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (isScanning) {
      const timeout = setTimeout(() => {
        setIsScanning(false);
        toast({
          title: "Scan complete",
          description: "All devices have been scanned for vulnerabilities",
        });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isScanning]);
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return Laptop;
      case "phone":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Laptop;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <span className="text-xs bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full flex items-center"><Shield className="h-3 w-3 mr-1" /> Low</span>;
      case "medium":
        return <span className="text-xs bg-yellow-900/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Medium</span>;
      case "high":
        return <span className="text-xs bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> High</span>;
      default:
        return <span className="text-xs bg-gray-900/20 text-gray-400 px-2 py-0.5 rounded-full">Unknown</span>;
    }
  };

  const toggleLock = (deviceId: number) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        const newLockedState = !device.isLocked;
        
        toast({
          title: newLockedState ? "Device locked" : "Device unlocked",
          description: `${device.name} has been ${newLockedState ? 'locked' : 'unlocked'}`,
        });
        
        return {
          ...device,
          isLocked: newLockedState
        };
      }
      return device;
    }));
  };

  const remoteShutdown = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    
    if (device) {
      toast({
        title: "Remote shutdown initiated",
        description: `${device.name} shutdown signal sent`,
      });
      
      // In a real app, this would send a signal to the device
      setDevices(devices.map(d => {
        if (d.id === deviceId) {
          return {
            ...d,
            status: "shutdown"
          };
        }
        return d;
      }));
      
      // Simulate the device going offline after shutdown
      setTimeout(() => {
        setDevices(devices.map(d => {
          if (d.id === deviceId) {
            return {
              ...d,
              status: "offline"
            };
          }
          return d;
        }));
      }, 3000);
    }
  };
  
  const handleScanDevices = () => {
    setIsScanning(true);
    toast({
      title: "Scanning devices",
      description: "Looking for new devices and security risks...",
    });
  };
  
  const handleAddDevice = () => {
    if (newDeviceName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a device name",
        variant: "destructive"
      });
      return;
    }
    
    const newDevice = {
      id: devices.length + 1,
      name: newDeviceName,
      type: newDeviceType,
      lastActive: "Just now",
      status: "online",
      isLocked: false,
      batteryLevel: 100,
      riskLevel: "low",
      osVersion: "Unknown",
      lastUpdate: "Just now"
    };
    
    setDevices([...devices, newDevice]);
    setNewDeviceName("");
    setShowAddDevice(false);
    
    toast({
      title: "Device added",
      description: `${newDeviceName} has been added to your devices`,
    });
  };
  
  const filteredDevices = devices.filter(device => {
    if (filterStatus === "all") return true;
    if (filterStatus === "online") return device.status === "online";
    if (filterStatus === "offline") return device.status === "offline" || device.status === "shutdown";
    if (filterStatus === "locked") return device.isLocked;
    return true;
  });
  
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "status") {
      if (a.status === "online" && b.status !== "online") return -1;
      if (a.status !== "online" && b.status === "online") return 1;
      return 0;
    }
    if (sortBy === "risk") {
      const riskOrder = { low: 0, medium: 1, high: 2 };
      return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder];
    }
    return 0;
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-6 neon-blue-text">Connected Devices</h3>
      
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-3">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-[#11111D] rounded-lg border border-[#2A2A3C] text-white text-sm"
          >
            <option value="all">All Devices</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="locked">Locked</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 bg-[#11111D] rounded-lg border border-[#2A2A3C] text-white text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="neon" 
            size="sm" 
            onClick={() => setShowAddDevice(!showAddDevice)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Device
          </Button>
          
          <Button 
            variant="blue" 
            size="sm" 
            onClick={handleScanDevices}
            disabled={isScanning}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Devices'}
          </Button>
        </div>
      </div>
      
      {/* Add Device Form */}
      {showAddDevice && (
        <div className="mb-6 p-4 bg-[#11111D] rounded-lg border border-[#2A2A3C] animate-fade-in">
          <h4 className="text-sm font-semibold mb-3 text-cyan-400">Add New Device</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Device name"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className="flex-1 p-2 bg-[#1E1E2C] rounded border border-[#2A2A3C] text-white"
            />
            
            <select
              value={newDeviceType}
              onChange={(e) => setNewDeviceType(e.target.value)}
              className="sm:w-1/3 p-2 bg-[#1E1E2C] rounded border border-[#2A2A3C] text-white"
            >
              <option value="laptop">Laptop</option>
              <option value="phone">Phone</option>
              <option value="tablet">Tablet</option>
            </select>
            
            <Button variant="blue" size="sm" onClick={handleAddDevice}>
              Add
            </Button>
          </div>
        </div>
      )}
      
      {/* Device List */}
      <div className="space-y-4">
        {sortedDevices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          
          return (
            <div key={device.id} className="p-4 bg-[#11111D] rounded-lg border border-[#2A2A3C] flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  device.status === "online" ? "bg-cyan-900/20 text-cyan-400" : "bg-gray-800 text-gray-400"
                }`}>
                  <DeviceIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{device.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`h-2 w-2 rounded-full ${
                      device.status === "online" ? "bg-green-500" : 
                      device.status === "shutdown" ? "bg-orange-500 animate-pulse" : "bg-gray-500"
                    }`}></span>
                    <span className="text-xs text-gray-400">{device.lastActive}</span>
                    {device.isLocked && (
                      <span className="text-xs bg-yellow-900/20 text-yellow-400 px-1.5 py-0.5 rounded-full flex items-center">
                        <Lock className="h-3 w-3 mr-1" /> Locked
                      </span>
                    )}
                    {getRiskBadge(device.riskLevel)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{device.lastUpdate}</span>
                </div>
                
                <div className="h-4 w-px bg-gray-700 mx-1"></div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleLock(device.id)}
                    className={`p-2 rounded-lg ${device.isLocked ? 'bg-yellow-900/20 text-yellow-400' : 'bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-yellow-400'} transition-colors`}
                    title={device.isLocked ? "Unlock device" : "Lock device"}
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                  
                  {device.status !== "shutdown" && (
                    <button 
                      onClick={() => remoteShutdown(device.id)}
                      className="p-2 rounded-lg bg-[#1E1E2C] hover:bg-[#252536] text-gray-400 hover:text-red-400 transition-colors"
                      title="Remote shutdown"
                    >
                      <PowerOff className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedDevices.length === 0 && (
          <div className="p-6 bg-[#11111D] rounded-lg border border-[#2A2A3C] text-center">
            <p className="text-gray-400">No devices match your current filters</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#2A2A3C] flex justify-between items-center">
        <span className="text-sm text-gray-400">Last scan: {isScanning ? 'In progress...' : '5 minutes ago'}</span>
        <Button variant="blue" size="sm" onClick={handleScanDevices} disabled={isScanning}>
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              Scanning...
            </>
          ) : (
            <>Scan for New Devices</>
          )}
        </Button>
      </div>
    </div>
  );
};
