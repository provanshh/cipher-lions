import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { fetchSuperSafeSettings, updateBlockExtensionsPage } from "@/api/superSafe";
import { toast } from "sonner";

export function BlockExtensionsPageToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const settings = await fetchSuperSafeSettings();
        setEnabled(settings.blockExtensionsPage);
      } catch {
        toast.error("Failed to load extension protection settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = async (value: boolean) => {
    setEnabled(value);
    try {
      await updateBlockExtensionsPage(value);
      toast.success(
        value
          ? "chrome://extensions page is now blocked"
          : "chrome://extensions page is now accessible"
      );
    } catch {
      toast.error("Failed to update setting");
      setEnabled((prev) => !prev);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-sm">Block Extensions Page</p>
        <p className="text-xs text-muted-foreground">
          Prevents the child from opening chrome://extensions to disable CipherGuard.
        </p>
      </div>
      <Switch disabled={loading} checked={enabled} onCheckedChange={handleChange} />
    </div>
  );
}
