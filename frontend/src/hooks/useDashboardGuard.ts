import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useDashboardGuard() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const legacyToken = localStorage.getItem("token");
    // Use whatever key name existing code uses for JWT — check signin.tsx

    if (isLoading) return;

    // Legacy fallback — if old JWT exists and Auth0 not used, let them through
    if (!isAuthenticated && legacyToken) {
      setIsAllowed(true);
      setShowVerification(false);
      return;
    }

    if (!isAuthenticated && !legacyToken) {
      navigate("/");
      setIsAllowed(false);
      return;
    }

    if (isAuthenticated && user?.email) {
      setEmail(user.email);
      supabase
        .from("users")
        .select("is_verified")
        .eq("email", user.email)
        .single()
        .then(({ data }) => {
          setIsAllowed(true);
          setShowVerification(!data?.is_verified);
        });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return { isAllowed, showVerification, email };
}


