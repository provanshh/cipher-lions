import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, Phone, HeadphonesIcon, Shield, FileCheck2, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { handlePostAuth } from "@/lib/auth-flow";
import { supabase } from "@/lib/supabaseClient";
import apiClient from "@/api/client";
import { useLanguage } from "@/context/LanguageContext";
import { voiceStrings } from "@/lib/voice-strings";

type ModalMode = "auth" | "verify-safety" | "verify-identity" | "verify-complete";
type AuthTab = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  initialMode?: ModalMode;
  initialTab?: AuthTab;
  onClose?: () => void;
}

const MIN_FONT_CLASS = "text-[18px]";

type VoiceKey = keyof (typeof voiceStrings)["en"];

function getVoiceKey(mode: ModalMode, activeTab: AuthTab): VoiceKey {
  if (mode === "auth") return activeTab === "login" ? "stepAuthLogin" : "stepAuthSignup";
  if (mode === "verify-safety") return "stepSafety";
  if (mode === "verify-identity") return "stepIdentity";
  return "stepVerifyComplete";
}

function speak(text: string, lang: "en" | "hi") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "hi" ? "hi-IN" : "en-IN";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function AuthModal({ open, initialMode = "auth", initialTab = "login", onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const { loginWithPopup, getIdTokenClaims } = useAuth0();
  const { lang, setLang } = useLanguage();

  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [currentEmail, setCurrentEmail] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [safetyChecks, setSafetyChecks] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const [aadhaarInput, setAadhaarInput] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (open) setAuthError(null);
  }, [open, activeTab]);

  const titleAndInstruction = useMemo(() => {
    if (mode === "auth") {
      return activeTab === "login"
        ? { title: "Welcome back", instruction: "Sign in to manage your child's protection." }
        : { title: "Create your account", instruction: "Sign up to start protecting your child's browsing." };
    }
    if (mode === "verify-safety") {
      return {
        title: "Quick Safety Check",
        instruction: "Confirm you are a parent or guardian setting this up for your child's safety.",
      };
    }
    if (mode === "verify-identity") {
      return {
        title: "Verify Your Identity",
        instruction: "Enter your Aadhaar number or upload a government ID to verify your identity.",
      };
    }
    return {
      title: "Verification Complete",
      instruction: "You are verified. We are setting up your dashboard.",
    };
  }, [mode, activeTab]);

  useEffect(() => {
    if (!open || !voiceEnabled) return;
    const key = getVoiceKey(mode, activeTab);
    speak(voiceStrings[lang][key], lang);
  }, [open, mode, activeTab, lang, voiceEnabled]);

  useEffect(() => {
    if (mode === "verify-complete" && currentEmail) {
      (async () => {
        try {
          await supabase.from("users").update({ is_verified: true }).eq("email", currentEmail);
        } catch (err) {
          console.error(err);
        }
        if (voiceEnabled) speak(voiceStrings[lang].stepComplete, lang);
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/dashboard");
        }, 1500);
      })();
    }
  }, [mode, currentEmail, navigate, onClose, voiceEnabled, lang]);

  if (!open) return null;

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await loginWithPopup({ connection: "google-oauth2" });
      const claims = await getIdTokenClaims();
      const email = claims?.email ?? undefined;
      const sub = claims?.sub ?? undefined;
      const name = claims?.name ?? undefined;
      if (!email || !sub) {
        throw new Error("Unable to read user profile from Auth0.");
      }
      setCurrentEmail(email);
      const { isVerified } = await handlePostAuth({
        email,
        name,
        sub,
      });
      if (isVerified) {
        navigate("/dashboard");
      } else {
        setMode("verify-safety");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
      setAuthError(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      const { data } = await apiClient.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      setCurrentEmail(loginEmail);
      const { isVerified } = await handlePostAuth({
        email: loginEmail,
        name: loginEmail,
        sub: `local|${loginEmail}`,
      });
      if (isVerified) {
        navigate("/dashboard");
      } else {
        setMode("verify-safety");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Login failed. Please try again.";
      setAuthError(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      const { data } = await apiClient.post("/api/auth/signup", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      setCurrentEmail(signupEmail);
      const { isVerified } = await handlePostAuth({
        email: signupEmail,
        name: signupName,
        sub: `local|${signupEmail}`,
      });
      if (isVerified) {
        navigate("/dashboard");
      } else {
        setMode("verify-safety");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Signup failed. Please try again.";
      setAuthError(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSafetyContinue = () => {
    setMode("verify-identity");
  };

  const handleIdentitySubmit = async () => {
    setIsLoading(true);
    try {
      // Placeholder KYC call – replace with real API when available
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMode("verify-complete");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthForm = () => {
    return (
      <div className="space-y-6">
        {authError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {authError}
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            className="w-full h-12 text-base"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {activeTab === "login" ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 font-medium ${MIN_FONT_CLASS}`}>
                <Mail className="h-5 w-5 text-primary" />
                Email
              </label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-12 text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 font-medium ${MIN_FONT_CLASS}`}>
                <Lock className="h-5 w-5 text-primary" />
                Password
              </label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="h-12 text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              />
            </div>
            <button
              type="button"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
            <Button
              type="button"
              className="w-full h-12 text-base"
              onClick={handleLogin}
              disabled={!loginEmail || !loginPassword || isSubmitting}
            >
              Log in
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 font-medium ${MIN_FONT_CLASS}`}>
                <User className="h-5 w-5 text-primary" />
                Name
              </label>
              <Input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="h-12 text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 font-medium ${MIN_FONT_CLASS}`}>
                <Mail className="h-5 w-5 text-primary" />
                Email
              </label>
              <Input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="h-12 text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 font-medium ${MIN_FONT_CLASS}`}>
                <Lock className="h-5 w-5 text-primary" />
                Password
              </label>
              <Input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="h-12 text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              />
            </div>
            <Button
              type="button"
              className="w-full h-12 text-base"
              onClick={handleSignup}
              disabled={!signupName || !signupEmail || !signupPassword || isSubmitting}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSafetyStep = () => {
    const allChecked = safetyChecks.every(Boolean);
    const items = [
      "I am the parent or guardian",
      "I will use this only for child safety",
      "I agree to the Terms of Service",
    ];

    return (
      <div className="space-y-5">
        <div className="space-y-3">
          {items.map((label, idx) => {
            const selected = safetyChecks[idx];
            return (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setSafetyChecks((prev) => {
                    const next = [...prev] as [boolean, boolean, boolean];
                    next[idx] = !next[idx];
                    return next;
                  })
                }
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                  selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
                }`}
              >
                <Shield className="h-6 w-6 text-primary" />
                <span className={MIN_FONT_CLASS}>{label}</span>
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          className="w-full h-12 text-base"
          onClick={handleSafetyContinue}
          disabled={!allChecked}
        >
          Continue
        </Button>
      </div>
    );
  };

  const formatAadhaar = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 12)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const renderIdentityStep = () => {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full flex-col items-start gap-2 rounded-xl border-2 border-border px-4 py-3 hover:border-primary/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <IdCard className="h-6 w-6 text-primary" />
              <span className="font-semibold">Aadhaar Number</span>
            </div>
            <Input
              type="text"
              value={aadhaarInput}
              onChange={(e) => setAadhaarInput(formatAadhaar(e.target.value))}
              placeholder="XXXX XXXX XXXX"
              className="h-12 text-base mt-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
              maxLength={14}
            />
          </button>

          <button
            type="button"
            className="flex w-full flex-col items-start gap-2 rounded-xl border-2 border-border px-4 py-3 hover:border-primary/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">Government ID</span>
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFileUpload(file);
              }}
              className="mt-1 text-sm"
            />
            {fileUpload && (
              <span className="text-xs text-muted-foreground mt-1">
                {fileUpload.name}
              </span>
            )}
          </button>
        </div>

        <p className={`${MIN_FONT_CLASS} text-muted-foreground flex items-center gap-2`}>
          <Lock className="h-5 w-5 text-primary" />
          <span>Why do we need this? Your data is encrypted and never shared.</span>
        </p>

        <Button
          type="button"
          className="w-full h-12 text-base"
          onClick={handleIdentitySubmit}
          disabled={isLoading || (!aadhaarInput && !fileUpload)}
        >
          {isLoading ? "Verifying your identity securely..." : "Verify and continue"}
        </Button>
      </div>
    );
  };

  const renderCompleteStep = () => {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative flex h-20 w-20 items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <FileCheck2 className="relative h-10 w-10 text-emerald-500" />
        </motion.div>
        <p className={`${MIN_FONT_CLASS} font-semibold`}>You're verified! Setting up your dashboard...</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/70 backdrop-blur-xl px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode + activeTab}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[420px] rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5"
        >
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">CipherGuard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full border border-border p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 rounded-full ${lang === "en" ? "bg-primary text-white" : "text-muted-foreground"}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  className={`px-2 py-1 rounded-full ${lang === "hi" ? "bg-primary text-white" : "text-muted-foreground"}`}
                >
                  HI
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Voice</span>
                <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-full border border-border ${!voiceEnabled ? "opacity-50" : ""}`}
                onClick={() => voiceEnabled && speak(voiceStrings[lang][getVoiceKey(mode, activeTab)], lang)}
              >
                <HeadphonesIcon className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </header>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{titleAndInstruction.title}</h2>
            <p className={`${MIN_FONT_CLASS} text-muted-foreground`}>{titleAndInstruction.instruction}</p>
          </div>

          {mode === "auth" && (
            <div className="space-y-4">
              <div className="flex rounded-full bg-muted p-1 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 rounded-full py-2 transition-colors ${
                    activeTab === "login" ? "bg-white shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 rounded-full py-2 transition-colors ${
                    activeTab === "signup" ? "bg-white shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              {renderAuthForm()}
            </div>
          )}

          {mode === "verify-safety" && renderSafetyStep()}
          {mode === "verify-identity" && renderIdentityStep()}
          {mode === "verify-complete" && renderCompleteStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

