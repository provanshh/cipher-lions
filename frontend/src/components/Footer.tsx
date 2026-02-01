
import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { ShieldLogo } from "./ShieldLogo";

export const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Function to handle smooth scrolling to sections on home page
  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home page with anchor
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="bg-[#111118] border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShieldLogo className="h-6 w-6 text-cipher-purple" />
              <span className="text-lg font-bold text-white">CipherGuard</span>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Smart AI protection for young minds, keeping children safe online while respecting their privacy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-cipher-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-cipher-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-cipher-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-cipher-purple transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('features')} className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Pricing</button></li>
              <li><Link to="/testimonials" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('faq')} className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">FAQ</button></li>
              <li><Link to="/contact" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Contact Us</Link></li>
              <li><Link to="/help" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Help Center</Link></li>
              <li><Link to="/community" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Cookie Policy</Link></li>
              <li><Link to="/compliance" className="text-sm text-gray-300 hover:text-cipher-purple transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} CipherGuard. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><Link to="/privacy" className="text-xs text-gray-300 hover:text-cipher-purple transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-xs text-gray-300 hover:text-cipher-purple transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="text-xs text-gray-300 hover:text-cipher-purple transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
