import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Child } from "@/types/models";
import { fetchChildren } from "@/api/children";
import { Copy as CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export interface ChildStatus {
  name: string;
  token: string;
  isActivated: boolean;
  activatedAt?: string;
  location?: string;
  lastSeen?: string;
}

interface ChildStatusCardProps {
  child: ChildStatus;
}

function formatRelativeTime(iso?: string) {
  if (!iso) return "Unknown";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "just now";
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} day${diffD === 1 ? "" : "s"} ago`;
}

export function ChildStatusCard({ child }: ChildStatusCardProps) {
  const [localChild, setLocalChild] = useState(child);

  useEffect(() => {
    setLocalChild(child);
  }, [child]);

  useEffect(() => {
    if (localChild.isActivated) return;

    const interval = window.setInterval(async () => {
      try {
        const children = await fetchChildren();
        const match = children.find((c: Child) => c.name === localChild.name);
        if (match && match.status === "online") {
          setLocalChild((prev) => ({
            ...prev,
            isActivated: true,
            activatedAt: prev.activatedAt ?? new Date().toISOString(),
            lastSeen: match.lastHeartbeat,
          }));
          if (interval) window.clearInterval(interval);
        }
      } catch {
        // ignore polling errors
      }
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [localChild.isActivated, localChild.name]);

  const handleCopy = async () => {
    if (!localChild.token) return;
    try {
      await navigator.clipboard.writeText(localChild.token);
    } catch {
      // ignore
    }
  };

  const activatedAtLabel = localChild.activatedAt
    ? format(new Date(localChild.activatedAt), "MMM d, yyyy 'at' h:mm a")
    : "Just now";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            👦
          </span>
          <h3 className="text-[18px] font-semibold">{localChild.name}</h3>
        </div>
        {localChild.isActivated ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            CipherGuard Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Awaiting Extension Activation
          </span>
        )}
      </div>

      {!localChild.isActivated ? (
        <div className="space-y-3">
          <p className="text-[15px] text-gray-600">
            Paste this token in the CipherGuard extension to activate protection.
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm">
              {localChild.token}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              title="Copy token"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px] text-gray-700 mt-2">
          <div>
            <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <span role="img" aria-label="activated">
                🕒
              </span>
              Activated
            </div>
            <div>{activatedAtLabel}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <span role="img" aria-label="location">
                📍
              </span>
              Location
            </div>
            <div>{localChild.location || "Fetching..."}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <span role="img" aria-label="last seen">
                👁️
              </span>
              Last Seen
            </div>
            <div>{formatRelativeTime(localChild.lastSeen)}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <span role="img" aria-label="protection">
                🛡️
              </span>
              Protection
            </div>
            <div>Content Filtering ON</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

