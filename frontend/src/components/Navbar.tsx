
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Info, Shield, CreditCard, HelpCircle, LayoutDashboard, Mail, LogOut, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ShieldLogo } from "./ShieldLogo";
import { CipherQueryModal } from "./CipherQueryModal";
import { toast } from "@/hooks/use-toast";
import { ModeToggle } from "./ModeToggle";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCipherModalOpen, setIsCipherModalOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const token = localStorage.getItem('token') || null;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  // Function to handle smooth scrolling to sections on home page
  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100, // Offset by navbar height
          behavior: 'smooth'
        });
      }
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    } else {
      // If not on home page, navigate to home page with anchor
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="py-4 px-6 md:px-12 lg:px-24 w-full fixed top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <ShieldLogo className="h-8 w-8 text-cipher-purple" />
          <span className="text-xl font-bold text-foreground neon-text">CipherGuard</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-5">
            <Link to="/" className="font-medium text-muted-foreground hover:text-cipher-purple transition-colors flex items-center gap-1.5">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="font-medium text-muted-foreground hover:text-cipher-purple transition-colors flex items-center gap-1.5"
            >
              <Shield size={18} />
              <span>Features</span>
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="font-medium text-muted-foreground hover:text-cipher-purple transition-colors flex items-center gap-1.5"
            >
              <Info size={18} />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="font-medium text-muted-foreground hover:text-cipher-purple transition-colors flex items-center gap-1.5"
            >
              <HelpCircle size={18} />
              <span>FAQ</span>
            </button>
            <Link to="/contact" className="font-medium text-muted-foreground hover:text-cipher-purple transition-colors flex items-center gap-1.5">
              <Mail size={18} />
              <span>Contact</span>
            </Link>
            {token && (
              <Link to="/dashboard" className="font-medium text-cipher-blue hover:text-cipher-blue-light transition-colors flex items-center gap-1.5">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <Button
                variant="outline"
                size="sm"
                className="border-cipher-purple/50 text-cipher-purple hover:bg-cipher-purple/10 flex items-center gap-2"
                onClick={() => setIsCipherModalOpen(true)}
              >
                <Cpu size={16} />
                <span>CIPHER</span>
              </Button>
            )}

            {!token ? (
              <Button variant="primary" onClick={() => navigate('../login')}>Login</Button>
            ) : (
              <Button
                variant="outline"
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4 px-6 flex flex-col gap-4 border-b border-border z-50">
          <Link to="/" className="font-medium text-muted-foreground py-2 hover:text-cipher-purple flex items-center gap-2">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <button
            onClick={() => scrollToSection('features')}
            className="font-medium text-muted-foreground py-2 hover:text-cipher-purple flex items-center gap-2 text-left"
          >
            <Shield size={18} />
            <span>Features</span>
          </button>
          <Link to="/dashboard" className="font-medium text-cipher-blue py-2 hover:text-cipher-blue-light flex items-center gap-2">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          {token && (
            <button
              onClick={() => setIsCipherModalOpen(true)}
              className="font-medium text-cipher-purple py-2 hover:text-cipher-purple/80 flex items-center gap-2 text-left"
            >
              <Cpu size={18} />
              <span>CIPHER Query</span>
            </button>
          )}

          {!token ? (
            <Button variant="primary" className="w-full mt-2" onClick={() => navigate('../login')}>
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          )}
        </div>
      )}

      <CipherQueryModal
        isOpen={isCipherModalOpen}
        onClose={() => setIsCipherModalOpen(false)}
      />
    </nav>
  );
};

