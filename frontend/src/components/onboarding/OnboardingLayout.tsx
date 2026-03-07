import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { LanguageToggle, type OnboardingLang } from "./LanguageToggle";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  instructionText: string;
  lang: OnboardingLang;
  onLangChange: (lang: OnboardingLang) => void;
}

export function OnboardingLayout({ children, instructionText, lang, onLangChange }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" aria-hidden />
          <span className="text-xl font-bold">CipherGuard</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} onLangChange={onLangChange} />
          <AudioButton text={instructionText} lang={lang} aria-label="Read instructions aloud" />
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-8">{children}</main>
    </div>
  );
}
