import { ReactNode, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      if (isLoading) return;

      if (!isAuthenticated || !user?.email) {
        setIsVerified(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("is_verified")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        setIsVerified(false);
        return;
      }

      setIsVerified(Boolean(data.is_verified));
    };

    void check();
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isVerified, navigate]);

  return (
    <>
      {children}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </>
  );
}

