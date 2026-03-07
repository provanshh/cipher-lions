import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, Bell } from "lucide-react";
import { SecurityOrb } from "@/components/hero/SecurityOrb";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onSignInClick?: (tab: "login" | "signup") => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

function FloatingNotification({
  icon: Icon,
  label,
  sublabel,
  color,
  bg,
  className,
  delay,
}: {
  icon: typeof Shield;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={cn("absolute z-20", className)}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      <motion.div
        className="rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/5 dark:shadow-black/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", bg)}>
            <Icon className={cn("h-[18px] w-[18px]", color)} />
          </div>
          <div className="pr-1">
            <p className="text-[13px] font-semibold leading-tight">{label}</p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{sublabel}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection({ onSignInClick }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden"
    >
      {/* Subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_70%)]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)/0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left column */}
          <div className="flex-1 max-w-[640px] text-center lg:text-left">
            <motion.h1
              className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.02em] mb-6 leading-[1.08]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
            >
              <span className="block">Keep your kids safe</span>
              <span className="block mt-1 text-muted-foreground">
                online. For real.
              </span>
            </motion.h1>

            <motion.p
              className="text-[17px] md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-[500px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              A Chrome extension that blocks harmful websites, filters inappropriate
              content, and alerts you when something's wrong. No spying. No keylogging.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
            >
              <Button
                size="lg"
                className="group text-[15px] h-12 px-7 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                onClick={() => onSignInClick?.("signup")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-[15px] h-12 px-7 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/60 hover:border-primary/20 transition-all"
                onClick={() => onSignInClick?.("login")}
              >
                Sign In
              </Button>
            </motion.div>
          </div>

          {/* Right column - Orb + floating cards */}
          <motion.div
            className="flex-1 relative w-full max-w-[520px] aspect-square"
            style={{ scale: orbScale, opacity: orbOpacity }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <SecurityOrb />
            </div>

            <FloatingNotification
              icon={Shield}
              label="Threat Blocked"
              sublabel="adult-content.example.com"
              color="text-emerald-500"
              bg="bg-emerald-500/10"
              className="top-[12%] -right-2 md:right-2"
              delay={0.8}
            />
            <FloatingNotification
              icon={Eye}
              label="Incognito Detected"
              sublabel="Private window opened at 3:42 PM"
              color="text-amber-500"
              bg="bg-amber-500/10"
              className="bottom-[22%] -left-4 md:left-0"
              delay={1.1}
            />
            <FloatingNotification
              icon={Bell}
              label="Content Filtered"
              sublabel="Inappropriate image blurred"
              color="text-primary"
              bg="bg-primary/10"
              className="bottom-[6%] right-[8%]"
              delay={1.4}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
