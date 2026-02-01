
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";
import { DashboardPreview } from "@/components/DashboardPreview";
import { FAQ } from "@/components/FAQ";
import { Testimonial } from "@/components/Testimonial";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "react-router-dom";
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
  ChevronRight,
  Shield,
} from "lucide-react";
import { ShieldLogo } from "@/components/ShieldLogo";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Image,
      title: "AI Content Filtering",
      description: "Real-time blurring of inappropriate images and videos to protect young eyes.",
      color: "purple",
    },
    {
      icon: LinkIcon,
      title: "Smart URL Filtering",
      description: "Automatically blocks unsafe websites while allowing educational content.",
      color: "blue",
    },
    {
      icon: MessageSquare,
      title: "Text Analysis Engine",
      description: "Detects bullying, profanity, and grooming content to keep conversations safe.",
      color: "purple",
    },
    {
      icon: Eye,
      title: "Incognito Mode Detection",
      description: "Notifies parents if child attempts to browse privately to avoid monitoring.",
      color: "blue",
    },
    {
      icon: Search,
      title: "Search & Site Tracking",
      description: "Logs queries and visited pages to provide insights on online behavior.",
      color: "purple",
    },
    {
      icon: Clock,
      title: "Custom Time Limits",
      description: "Manage screen time by category or domain with flexible scheduling.",
      color: "blue",
    },
    {
      icon: Grid3X3,
      title: "Website Classification",
      description: "Auto-categorizes visited sites into education, gaming, social media, and more.",
      color: "purple",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description: "Get instant alerts for risky content or behavior requiring attention.",
      color: "blue",
    },
    {
      icon: Lock,
      title: "Privacy First Approach",
      description: "No keylogging or invasive surveillance. Fully transparent protection.",
      color: "purple",
    },
  ];

  const pricingPlans = [
    {
      title: "Basic",
      price: "Free",
      description: "Essential protection for families getting started",
      features: [
        "Basic content filtering",
        "Limited site blocking",
        "Daily screen time limits",
        "1 child profile",
        "Limited reporting",
      ],
      isPopular: false,
      ctaText: "Get Started",
    },
    {
      title: "Premium",
      price: "$9.99",
      description: "Complete protection with advanced monitoring",
      features: [
        "Advanced AI content filtering",
        "Smart URL analysis & blocking",
        "Custom time schedules per category",
        "Up to 5 child profiles",
        "Detailed analytics dashboard",
        "Real-time notifications",
        "Incognito mode detection",
        "30-day history retention",
      ],
      isPopular: true,
      ctaText: "Try 14 Days Free",
    },
    {
      title: "Family",
      price: "$14.99",
      description: "Ultimate protection for larger families",
      features: [
        "All Premium features",
        "Unlimited child profiles",
        "Priority support",
        "Cross-device synchronization",
        "Location tracking (optional)",
        "Export reports",
        "90-day history retention",
      ],
      isPopular: false,
      ctaText: "Try 14 Days Free",
    },
  ];

  const testimonials = [
    {
      quote: "CipherGuard gives me peace of mind knowing my kids are protected online without feeling like I'm invading their privacy.",
      author: "Sarah Johnson",
      role: "Mother of two",
    },
    {
      quote: "The dashboard is intuitive and gives me exactly the information I need without overwhelming me with unnecessary details.",
      author: "Michael Reynolds",
      role: "Father of three",
    },
    {
      quote: "My kids actually like it because it's not intrusive, and they understand it's there to keep them safe, not to spy on them.",
      author: "Jennifer Torres",
      role: "Mother of a teenager",
    },
  ];

  const faqs = [
    {
      question: "Does CipherGuard monitor private conversations?",
      answer: "No. CipherGuard only analyzes content for potential risks without recording or storing private conversations. We prioritize both safety and privacy.",
    },
    {
      question: "Will it slow down my child's browsing experience?",
      answer: "CipherGuard is designed to work efficiently with minimal impact on browsing speed. Our lightweight extension operates in the background without noticeable delays.",
    },
    {
      question: "How does the content filtering work?",
      answer: "Our AI system analyzes images, videos, and text in real-time to detect inappropriate content. When detected, it can blur content, block access, or alert parents depending on your settings.",
    },
    {
      question: "Can my child bypass or disable CipherGuard?",
      answer: "CipherGuard requires parent authentication to modify or disable settings. We also provide alerts if uninstall attempts are detected.",
    },
    {
      question: "Is my family's data secure?",
      answer: "Absolutely. We use end-to-end encryption and store minimal data. We never sell user information and comply with all child privacy regulations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Smart AI Protection for Young Minds
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Keep your children safe online without invading their privacy. Our AI-powered protection shields young minds from harmful content while building digital responsibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="blue" size="lg" onClick={() => scrollToSection('pricing')}>
                Try For Free
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  See Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-lg animate-float">
              <div className="glass-card p-6 rounded-2xl shadow-xl">
                <div className="bg-white/90 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldLogo className="h-6 w-6 text-cipher-purple" />
                    <h3 className="font-bold text-cipher-gray-dark">CipherGuard</h3>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 flex items-start mb-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-green-800">Protected</h4>
                      <p className="text-sm text-green-700">Emma is browsing safely</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Daily screen time</span>
                      <span className="text-xs bg-cipher-purple/10 text-cipher-purple py-0.5 px-2 rounded-full">
                        2h 45m remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cipher-purple h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="enhanced-section bg-[#111118] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Features That Protect Without Intruding"
            subtitle="Our advanced protection keeps children safe while respecting their privacy and fostering digital responsibility."
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color as "purple" | "blue" | "default"}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="See How CipherGuard Works"
            subtitle="Explore our intuitive dashboard that gives you insights without overwhelming you with data."
            centered={true}
          />
          
          <div className="mt-8">
            <DashboardPreview />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-cipher-gray mb-6 max-w-2xl mx-auto">
              CipherGuard's easy-to-use dashboard gives you complete visibility into your child's online activity
              while maintaining their privacy and dignity.
            </p>
            <Link to="/dashboard">
              <Button variant="primary">
                Try The Dashboard Free <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="enhanced-section bg-[#111118] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Trusted By Parents"
            subtitle="Hear from parents who use CipherGuard to protect their children online."
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that works for your family's needs. All plans come with a 14-day free trial."
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                ctaText={plan.ctaText}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-cipher-gray">
              All plans include basic support. Need help choosing? <button onClick={() => scrollToSection('faq')} className="text-cipher-purple underline">Contact us</button>
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="enhanced-section bg-[#111118] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about CipherGuard."
            centered={true}
          />
          
          <FAQ faqs={faqs} />
          
          <div className="mt-12 text-center">
            <p className="text-cipher-gray mb-6">
              Have more questions? We're here to help.
            </p>
            <Link to="/contact">
              <Button variant="primary">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="hero-gradient py-20 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Protect Your Child Online?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Get started with CipherGuard today and give your children the freedom to explore
            the internet safely and responsibly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="blue" size="lg" onClick={() => scrollToSection('pricing')}>
              Try For Free
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
