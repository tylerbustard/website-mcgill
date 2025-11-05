import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import EducationSection from "@/components/about-section";
import ExperienceSection from "@/components/experience-section";
import CertificationsSection, { CommunitySection } from "@/components/skills-section";
import ContactInfoSection from "@/components/contact-info-section";

export default function Home() {
  const [location] = useLocation();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;
    
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        // Only update if there's a significant change
        if (Math.abs(scrollY - lastKnownScrollY) > 50) {
          setShowScrollToTop(scrollY > 300);
          lastKnownScrollY = scrollY;
        }
      }, 100);
    };

    // Initial check
    setShowScrollToTop(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <EducationSection />
      <ExperienceSection />
      <CertificationsSection />
      <CommunitySection />
      <ContactInfoSection />
      
      {/* Clean Scroll to Top Button with Glass Effect */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ease-in-out rounded-full glass-panel ${
          showScrollToTop 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none translate-y-4'
        } hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        data-testid="scroll-to-top-button"
      >
        <div className="flex items-center px-5 py-3">
          <span className="text-sm font-medium mr-3 text-gray-700">
            Back to top
          </span>
          <div className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
            <ChevronUp size={18} />
          </div>
        </div>
      </button>
      
      {/* Clean Footer with Smooth Transition */}
      <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 py-8 transition-all duration-500">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/90 font-medium">
              © {new Date().getFullYear()} Tyler Bustard. All rights reserved.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('previousPage', location);
                window.location.href = '/sign-in';
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white transition-all duration-200 hover:scale-105"
              data-testid="footer-employer-signin"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
