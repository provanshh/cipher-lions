import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";
import { FAQ } from "@/components/FAQ";
import { Testimonial } from "@/components/Testimonial";
import { SectionHeading } from "@/components/SectionHeading";
import { GradientText } from "@/components/animations/GradientText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { HeroGrid, HeroGlow, AnimatedBeams, AuroraGradient } from "@/components/hero/HeroBackground";
import { SecurityOrb } from "@/components/hero/SecurityOrb";
import { FloatingCards } from "@/components/hero/FloatingCards";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Spotlight, MouseSpotlight } from "@/components/effects/Spotlight";
import { Meteors } from "@/components/effects/Meteors";
import { FlipWords } from "@/components/effects/FlipWords";
import { TextGenerateEffect } from "@/components/effects/TextGenerateEffect";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Image,
  Link as LinkIcon,
  MessageSquare,
  Eye,
  Search,
  Clock,
  Grid3X3,
  Bell,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  { icon: Image, title: "AI Content Filtering", description: "Real-time blurring of inappropriate images and videos to protect young eyes." },
  { icon: LinkIcon, title: "Smart URL Filtering", description: "Automatically blocks unsafe websites while allowing educational content." },
  { icon: MessageSquare, title: "Text Analysis Engine", description: "Detects bullying, profanity, and grooming content to keep conversations safe." },
  { icon: Eye, title: "Incognito Detection", description: "Notifies parents if a child attempts to browse privately to avoid monitoring." },
  { icon: Search, title: "Search & Site Tracking", description: "Logs queries and visited pages to provide insights on online behavior." },
  { icon: Clock, title: "Custom Time Limits", description: "Manage screen time by category or domain with flexible scheduling." },
  { icon: Grid3X3, title: "Website Classification", description: "Auto-categorizes visited sites into education, gaming, social media, and more." },
  { icon: Bell, title: "Real-Time Notifications", description: "Get instant alerts for risky content or behavior requiring attention." },
  { icon: Lock, title: "Privacy First Approach", description: "No keylogging or invasive surveillance. Fully transparent protection." },
];

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    description: "Essential protection for families getting started",
    features: ["Basic content filtering", "Limited site blocking", "Daily screen time limits", "1 child profile", "Limited reporting"],
    isPopular: false,
    ctaText: "Get Started",
  },
  {
    title: "Premium",
    price: "$9.99",
    description: "Complete protection with advanced monitoring",
    features: ["Advanced AI content filtering", "Smart URL analysis & blocking", "Custom time schedules per category", "Up to 5 child profiles", "Detailed analytics dashboard", "Real-time notifications", "Incognito mode detection", "30-day history retention"],
    isPopular: true,
    ctaText: "Try 14 Days Free",
  },
  {
    title: "Family",
    price: "$14.99",
    description: "Ultimate protection for larger families",
    features: ["All Premium features", "Unlimited child profiles", "Priority support", "Cross-device synchronization", "Export reports", "90-day history retention"],
    isPopular: false,
    ctaText: "Try 14 Days Free",
  },
];

const testimonials = [
  { quote: "CipherGuard gives me peace of mind knowing my kids are protected online without feeling like I'm invading their privacy.", author: "Sarah Johnson", role: "Mother of two" },
  { quote: "The dashboard is intuitive and gives me exactly the information I need without overwhelming me with unnecessary details.", author: "Michael Reynolds", role: "Father of three" },
  { quote: "My kids actually like it because it's not intrusive, and they understand it's there to keep them safe, not to spy on them.", author: "Jennifer Torres", role: "Mother of a teenager" },
];

const faqs = [
  { question: "Does CipherGuard monitor private conversations?", answer: "No. CipherGuard only analyzes content for potential risks without recording or storing private conversations. We prioritize both safety and privacy." },
  { question: "Will it slow down my child's browsing experience?", answer: "CipherGuard is designed to work efficiently with minimal impact on browsing speed. Our lightweight extension operates in the background without noticeable delays." },
  { question: "How does the content filtering work?", answer: "Our AI system analyzes images, videos, and text in real-time to detect inappropriate content. When detected, it can blur content, block access, or alert parents depending on your settings." },
  { question: "Can my child bypass or disable CipherGuard?", answer: "CipherGuard requires parent authentication to modify or disable settings. We also provide alerts if uninstall attempts are detected." },
  { question: "Is my family's data secure?", answer: "Absolutely. We use end-to-end encryption and store minimal data. We never sell user information and comply with all child privacy regulations." },
];

const steps = [
  { step: "01", title: "Install Extension", desc: "Add the CipherGuard Chrome extension to your child's browser in seconds." },
  { step: "02", title: "Configure Settings", desc: "Set protection levels, time limits, and notification preferences from your dashboard." },
  { step: "03", title: "Monitor & Protect", desc: "Get real-time insights and alerts while your child browses safely." },
];

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: "smooth" });
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 pb-24 md:pt-40 md:pb-36 px-6 overflow-hidden">
        {/* Aceternity-style layered backgrounds */}
        <AuroraGradient />
        <HeroGrid />
        <HeroGlow />
        <Spotlight />
        <MouseSpotlight />
        <AnimatedBeams />
        <Meteors count={8} />

        <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: Text */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Badge variant="secondary" className="mb-6 gap-1.5 border-primary/20 bg-primary/5 text-primary px-3 py-1.5 text-sm">
                <Zap className="h-3.5 w-3.5" />
                AI-Powered Child Safety
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              Smart Protection for{" "}
              <GradientText className="relative">
                <FlipWords
                  words={["Young Minds", "Digital Safety", "Online Privacy", "Every Family"]}
                  duration={3000}
                />
              </GradientText>
            </motion.h1>

            <TextGenerateEffect
              words="Keep your children safe online without invading their privacy. Our AI-powered extension shields young minds from harmful content while building digital responsibility."
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg"
            />

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-lg shadow-primary/25 text-base h-12 px-8"
                onClick={() => scrollToSection("pricing")}
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary via-violet-600 to-primary bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 border-border/60 hover:bg-muted/50">
                  See Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              className="flex items-center gap-8 mt-10 pt-8 border-t border-border/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { value: "10K+", label: "Families protected" },
                { value: "99.9%", label: "Threat detection" },
                { value: "< 1s", label: "Response time" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <p className="text-2xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Orb + Floating Cards */}
          <div className="flex-1 relative max-w-lg w-full flex items-center justify-center">
            <SecurityOrb />
            <FloatingCards />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            badge="Features"
            title="Features That Protect Without Intruding"
            subtitle="Advanced protection that keeps children safe while respecting their privacy and fostering digital responsibility."
            centered
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            badge="How It Works"
            title="Three Steps to Online Safety"
            subtitle="Set up complete protection for your child in under 5 minutes."
            centered
          />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <SpotlightCard className="text-center">
                  <div className="p-8">
                    <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary font-bold text-lg mb-5">
                      {item.step}
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-14 text-center" delay={0.3}>
            <Link to="/dashboard">
              <Button className="group shadow-lg shadow-primary/20">
                Try The Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Parents Worldwide"
            subtitle="Hear from parents who use CipherGuard to protect their children online."
            centered
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.1}>
            {testimonials.map((t, i) => (
              <StaggerItem key={i}>
                <Testimonial quote={t.quote} author={t.author} role={t.role} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            badge="Pricing"
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that works for your family. All plans come with a 14-day free trial."
            centered
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4" staggerDelay={0.1}>
            {pricingPlans.map((plan, i) => (
              <StaggerItem key={i}>
                <PricingCard {...plan} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <SectionHeading
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about CipherGuard."
            centered
          />
          <ScrollReveal>
            <FAQ faqs={faqs} />
          </ScrollReveal>
          <ScrollReveal className="mt-12 text-center" delay={0.2}>
            <p className="text-sm text-muted-foreground mb-4">Have more questions? We're here to help.</p>
            <Link to="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-violet-500/5 to-cyan-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] opacity-30" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ready to Protect Your{" "}
            <GradientText>Child Online</GradientText>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Get started with CipherGuard today and give your children the freedom to explore
            the internet safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="group shadow-lg shadow-primary/20" onClick={() => scrollToSection("pricing")}>
              Get Started Free
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Learn More</Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
