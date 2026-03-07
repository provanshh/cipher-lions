import { useEffect, useState } from "react";
import { Child } from "@/types/models";
import { fetchChildren } from "@/api/children";
import { ChildStatusCard, ChildStatus } from "./ChildStatusCard";
import { AddChildModal } from "@/components/child/AddChildModal";
import { Button } from "@/components/ui/button";

export function ChildrenSection() {
  const [children, setChildren] = useState<ChildStatus[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchChildren();
        const mapped: ChildStatus[] = data.map((c: Child) => ({
          name: c.name,
          token: c.token || c.extensionToken || "",
          isActivated: Boolean(c.token || c.extensionToken) || c.status === "online",
          activatedAt: undefined,
          location: c.location,
          lastSeen: c.lastHeartbeat,
        }));
        setChildren(mapped);
      } catch {
        setChildren([]);
      }
    };
    void load();
  }, []);

  const handleChildAdded = (child: { name: string; token: string }) => {
    setChildren((prev) => [
      ...prev,
      {
        name: child.name,
        token: child.token,
        isActivated: false,
        activatedAt: undefined,
        location: undefined,
        lastSeen: undefined,
      },
    ]);
  };

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold flex items-center gap-2">
          <span role="img" aria-label="children">
            👨‍👧
          </span>
          Your Children
        </h2>
        <Button
          type="button"
          size="sm"
          className="h-9 px-3"
          onClick={() => setShowAddModal(true)}
        >
          + Add Child
        </Button>
      </div>

      {children.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center space-y-2">
          <p className="text-[18px] font-medium">No child profiles yet</p>
          <p className="text-[15px] text-gray-500">
            Add your first child to start monitoring and protecting their browsing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((c) => (
            <ChildStatusCard key={c.name + c.token} child={c} />
          ))}
        </div>
      )}

      <AddChildModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onChildAdded={handleChildAdded}
      />
    </section>
  );
}

