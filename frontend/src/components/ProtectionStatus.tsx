
import { Shield, ShieldAlert } from "lucide-react";

interface ProtectionStatusProps {
  isActive: boolean;
}

export const ProtectionStatus = ({ isActive }: ProtectionStatusProps) => {
  return (
    <div className={`glass-card p-4 ${isActive ? 'border-green-800/30' : 'border-red-800/30'}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">Protection Status</h3>
        <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg flex items-center space-x-3 ${
        isActive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
      }`}>
        {isActive ? (
          <>
            <Shield className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Active Protection</p>
              <p className="text-xs opacity-80">All systems operational</p>
            </div>
          </>
        ) : (
          <>
            <ShieldAlert className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Protection Disabled</p>
              <p className="text-xs opacity-80">Click to activate protection</p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4">
        <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
            : 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
        }`}>
          {isActive ? 'Disable Protection' : 'Enable Protection'}
        </button>
      </div>
    </div>
  );
};
